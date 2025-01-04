using System.Security.Cryptography;

namespace Hue.Data.Utils {
    /// <summary>
    /// Hashy is one of my characters just like Hue. But in this context
    /// its just a password hasher and unhasher
    /// </summary>
    public class Hashy {

        public class ToGoBox {
            public required byte[] Hashbrown { get; set; }
            public required byte[] Salt { get; set; }
        }

        private const int SaltSize = 16; // 128 bits
        private const int HashSize = 32; // 256 bits
        private const int Iterations = 10000;

        /// <summary>Generates a Hashy and bundles him with salt</summary>
        /// <param name="password">Password that Hashy should remember</param>
        /// <returns>A tuple of the hash and its salt in a to-go box</returns>
        public static ToGoBox ToGo(string password) {
            // Generate a random salt
            byte[] salt = MineSalt(SaltSize);

            // Hash the password using PBKDF2
            byte[] hash = PBKDF2(password, salt, Iterations, HashSize);

            // Convert to Base64 for storage
            return new() { 
                Hashbrown = hash,
                Salt = salt,
            };
        }

        //Verifies the password with the given hash and salt
        public static bool Check(string password, ToGoBox? box) {
            
            //Make sure we have a box
            if(box == null) return false;

            // Hash the provided password with the stored salt
            byte[] testHash = PBKDF2(password, box.Salt, Iterations, box.Hashbrown.Length);

            // Compare hashes in a constant-time manner to prevent timing attacks
            return CryptographicOperations.FixedTimeEquals(box.Hashbrown, testHash);
        }

        // PBKDF2 implementation
        private static byte[] PBKDF2(string password, byte[] salt, int iterations, int hashLength) {
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA512);
            return pbkdf2.GetBytes(hashLength);
        }

        /// <summary>Heads to the mines and mines a salt for the Hashy</summary>
        /// <param name="size"></param>
        /// <returns></returns>
        private static byte[] MineSalt(int size) {
            byte[] salt = new byte[size];
            RandomNumberGenerator.Fill(salt); // Modern and secure
            return salt;
        }

    }
}
