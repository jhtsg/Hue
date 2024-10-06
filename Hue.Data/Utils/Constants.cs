namespace Hue.Data.Utils
{
    public static class Constants
    {

        public static readonly string SCHEMA = "hue";

        public static readonly string USER_TABLE = $"{SCHEMA}.user ";
        public static readonly string USER_NM = "user_nm";
        public static readonly string PASS_TX = "pass_tx";
        public static readonly string ARTIST_IN = "artist_in";

        public static readonly string ARTIST_TABLE = $"{SCHEMA}.artist";
        public static readonly string ARTIST_ID = "artist_id";
        public static readonly string ARTIST_NM = "artist_nm";
        public static readonly string ARTIST_SOCIAL_TX = "artist_social_tx";
        public static readonly string ARTIST_COMM_SHEET_TX = "artist_comm_sheet_tx";
        public static readonly string ARTIST_IMG_BYTES = "artist_img_bytes";
        public static readonly string ARTIST_IMG_MIME_TX = "artist_img_mime_tx";

        public static readonly string CHAR_TABLE = $"{SCHEMA}.char";
        public static readonly string CHAR_ID = "char_id";
        public static readonly string CHAR_NM = "char_nm";
        public static readonly string CHAR_SPECIES_TX = "char_species_tx";
        public static readonly string CHAR_DESC_TX = "char_desc_tx";
        public static readonly string CHAR_COLOR_TX = "char_color_tx";
        public static readonly string CHAR_IMG_BYTES = "char_img_bytes";
        public static readonly string CHAR_IMG_MIME_TX = "char_img_mime_tx";

        public static readonly string CHAR_CAT_TABLE = $"{SCHEMA}.char_cat";
        public static readonly string CHAR_CAT_ID = "char_cat_id";
        public static readonly string CHAR_CAT_NM = "char_cat_nm";
        public static readonly string CHAR_CAT_DESC_TX = "char_cat_desc_tx";
        public static readonly string CHAR_CAT_COLOR_TX = "char_cat_color_tx";

        public static readonly string COMM_TABLE = $"{SCHEMA}.comm";
        public static readonly string COMM_ID = "comm_id";
        public static readonly string COMM_NM = "comm_nm";
        public static readonly string COMM_DESC_TX = "comm_desc_tx";
        public static readonly string COMM_PRICE_NB = "comm_price_nb";
        public static readonly string COMM_CHAR_CNT = "comm_char_cnt";
        public static readonly string COMM_POST_TAGS_TX = "comm_post_tags_tx";
        public static readonly string COMM_POST_DESC_TX = "comm_post_desc_tx";
        public static readonly string COMM_STATUS_CD = "comm_status_cd";
        public static readonly string COMM_TYPE_CD = "comm_type_cd";
        public static readonly string COMM_HEADER_IMG_BYTES = "comm_header_img_bytes";
        public static readonly string COMM_HEADER_IMG_MIME_TYPE = "comm_header_img_mime_tx";

        public static readonly string COMM_TAG_TABLE = $"{SCHEMA}.comm_tag";
        public static readonly string COMM_TAG_ID = "comm_tag_id";
        public static readonly string COMM_TAG_NM = "comm_tag_nm";
        public static readonly string COMM_TAG_DESC_TX = "comm_tag_desc_tx";
        public static readonly string COMM_TAG_COLOR_TX = "comm_tag_color_tx";

        public static readonly string COMM_CHAR_MAP = $"{SCHEMA}.comm_char_map";
        public static readonly string COMM_TAG_MAP = $"{SCHEMA}.comm_tag_map";

        public static readonly string CRE_TS = "cre_ts";
        public static readonly string UPDT_TS = "updt_ts";
        public static readonly string START_TS = "start_ts";
        public static readonly string DONE_TS = "done_ts";
        public static readonly string PBLSH_TS = "pblsh_ts";

    }
}
