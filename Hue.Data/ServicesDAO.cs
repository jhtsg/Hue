using Hue.Common.Artist;
using Hue.Data.Utils;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;
using Hue.Common.Commission;
using static Hue.Data.Utils.AdoTemplate;

namespace Hue.Data {
    public class ServicesDAO(string connectionString) {
        
        readonly AdoTemplate adoTemplate = new(connectionString);

        #region CREATE

        public async Task<Service?> Create(string username, Service service) {

            //Make sure the user owns the artist
            if (!(await ArtistDAO.UserOwnsArtist(adoTemplate, username, service.Artist.Id))) {
                throw new InvalidOperationException("User does not own artist");
            };


            var serviceSql = InsertSql(
                [
                    ARTIST_ID, COMM_TYPE_CD, 
                    SERVICE_NM, SERVICE_DESC_TX, 
                    SERVICE_BASE_PRICE_NB, SERVICE_CURRENCY_CD
                ],
                SERVICE_TABLE,
                SERVICE_ID
            );

            var serviceId = await adoTemplate.QuerySingle(serviceSql, (cmd) => {
                cmd.SetInt(ARTIST_ID,service.Artist.Id);
                cmd.SetInt(COMM_TYPE_CD, (int)service.CommissionType);
                cmd.SetString(SERVICE_NM, service.Name);
                cmd.SetString(SERVICE_DESC_TX, service.Description);
                cmd.SetInt(SERVICE_BASE_PRICE_NB, service.BasePrice);
                cmd.SetString(SERVICE_CURRENCY_CD, service.Currency);
            }, (reader) => reader.GetInt(SERVICE_ID));

            await CreateAdditions(serviceId, service.Additions);

            return await Get(username, serviceId);

        }

        private async Task CreateAdditions(int serviceId, List<ServiceAddition> additions) {

            var additionsSql = InsertSql(
                [
                    SERVICE_ID,
                    SERVICE_ADDT_NM, SERVICE_ADDT_DESC_TX,
                    SERVICE_ADDT_PRICE_NB, SERVICE_ADDT_LIMIT_NB
                ],
                SERVICE_ADDITIONS_TABLE,
                SERVICE_ADDT_ID
            );

            await adoTemplate.ExecuteBatch(additionsSql, (cmd, a) => {
                cmd.SetInt(SERVICE_ID, serviceId);
                cmd.SetString(SERVICE_ADDT_NM, a.Name);
                cmd.SetString(SERVICE_ADDT_DESC_TX, a.Description);
                cmd.SetInt(SERVICE_ADDT_PRICE_NB, a.Price);
                cmd.SetInt(SERVICE_ADDT_LIMIT_NB, a.Limit);
            }, additions);
        }

        #endregion

        private struct ServiceRow { 
            public int ServiceId { get; set; }
            public CommissionType CommType { get; set; }
            public string ServiceName { get; set; }
            public string ServiceDescription { get; set; }
            public int ServiceBasePrice { get; set; }
            public string ServiceCurrency { get; set; }

            public int? ServiceAdditionId { get; set; }
            public string? ServiceAdditionName { get; set; }
            public string? ServiceAdditionDescription { get; set; }
            public int? ServiceAdditionPrice { get; set; }
            public int? ServiceAdditionLimit { get; set; }
            
            public int ArtistId { get; set; }
            public string ArtistName { get; set; }
            public string ArtistSocial { get; set; }
            public string ArtistCommUrl { get; set; }
            public string ArtistPaymentUrl { get; set; }
            public bool ArtistImgPresent { get; set; }
            public bool ArtistRetired { get; set; }

            public static readonly List<string> Columns = [
                "s." + SERVICE_ID, COMM_TYPE_CD, SERVICE_NM, SERVICE_DESC_TX,SERVICE_BASE_PRICE_NB, SERVICE_CURRENCY_CD,
                SERVICE_ADDT_ID, SERVICE_ADDT_NM,SERVICE_ADDT_DESC_TX,SERVICE_ADDT_PRICE_NB,SERVICE_ADDT_LIMIT_NB,
                "s." + ARTIST_ID, ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX,PAYMENT_URL_TX, ARTIST_IMG_PRESENT_IN,RETIRED_IN
            ];

            public static string Select() {
                return SelectSql(Columns,
                    $"{SERVICE_TABLE} s left join {SERVICE_ADDITIONS_TABLE} asa on s.{SERVICE_ID} = asa.{SERVICE_ID}, {ARTIST_TABLE} a",
                    new WhereConditionGroup([new JoinCondition("a", "s", ARTIST_ID), new(USER_NM)]),
                    [new(ARTIST_NM), new(SERVICE_BASE_PRICE_NB)]
                );
            }

            public static string Select(WhereConditionGroup conditions) {
                return SelectSql(Columns,
                    $"{SERVICE_TABLE} s left join {SERVICE_ADDITIONS_TABLE} asa on s.{SERVICE_ID} = asa.{SERVICE_ID}, {ARTIST_TABLE} a",
                    new WhereConditionGroup([new JoinCondition("a", "s", ARTIST_ID), new(USER_NM), new WhereConditionSubgroup(conditions)]),
                    [new(ARTIST_NM),new(SERVICE_BASE_PRICE_NB)]
                );
            }

            public static ServiceRow RowMapper(Getter reader) {
                return new() {
                    ServiceId = reader.GetInt(SERVICE_ID),
                    CommType = (CommissionType)reader.GetInt(COMM_TYPE_CD),
                    ServiceName = reader.GetString(SERVICE_NM),
                    ServiceDescription = reader.GetString(SERVICE_DESC_TX),
                    ServiceBasePrice = reader.GetInt(SERVICE_BASE_PRICE_NB),
                    ServiceCurrency = reader.GetString(SERVICE_CURRENCY_CD),
                    
                    ServiceAdditionId = reader.GetOptionalInt(SERVICE_ADDT_ID),
                    ServiceAdditionName = reader.GetOptionalString(SERVICE_ADDT_NM),
                    ServiceAdditionDescription = reader.GetOptionalString(SERVICE_ADDT_DESC_TX),
                    ServiceAdditionPrice = reader.GetOptionalInt(SERVICE_ADDT_PRICE_NB),
                    ServiceAdditionLimit = reader.GetOptionalInt(SERVICE_ADDT_LIMIT_NB),

                    ArtistId = reader.GetInt(ARTIST_ID),
                    ArtistName = reader.GetString(ARTIST_NM),
                    ArtistSocial = reader.GetString(ARTIST_SOCIAL_TX),
                    ArtistCommUrl = reader.GetString(ARTIST_COMM_SHEET_TX),
                    ArtistPaymentUrl = reader.GetString(PAYMENT_URL_TX),
                    ArtistImgPresent = reader.GetBoolean(ARTIST_IMG_PRESENT_IN),
                    ArtistRetired = reader.GetBoolean(RETIRED_IN)
                };
            }

            public static List<Service> ToServices(List<ServiceRow> rows) {
                return rows.GroupBy(a => a.ServiceId, a => a, (serviceId, rows) => {
                    var firstRow = rows.First();
                    return new Service() {
                        Id = firstRow.ServiceId,
                        Name = firstRow.ServiceName,
                        Description = firstRow.ServiceDescription,
                        CommissionType = firstRow.CommType,
                        BasePrice = firstRow.ServiceBasePrice,
                        Currency = firstRow.ServiceCurrency,
                        Artist = new() {
                            Id = firstRow.ArtistId,
                            Name = firstRow.ArtistName,
                            SocialUrl = firstRow.ArtistSocial,
                            CommSheetUrl = firstRow.ArtistCommUrl,
                            IsRetired = firstRow.ArtistRetired,
                            HasImage = firstRow.ArtistImgPresent,
                            PaymentUrl = firstRow.ArtistPaymentUrl
                        },
                        Additions = rows.Where(a=>a.ServiceAdditionId != null)
                            .Select(a => new ServiceAddition() {
                                Id = a.ServiceAdditionId ?? 0,
                                Name = a.ServiceAdditionName ?? "",
                                Description = a.ServiceAdditionDescription ?? "",
                                Price = a.ServiceAdditionPrice ?? 0,
                                Limit = a.ServiceAdditionLimit ?? -1
                            }).ToList()

                    };
                }).ToList();
            }
        
        }


        #region READ
        public async Task<Service?> Get(string username, int id) {
            var sql = ServiceRow.Select(new([new("S." + SERVICE_ID, WhereConditionOperator.EQUALS, "@SERVICE_ID")]));
            return ServiceRow.ToServices(await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(SERVICE_ID, id);
            }, ServiceRow.RowMapper)).FirstOrDefault();
        }

        public async Task<List<Service>> GetAll(string username, int? artistId, int? commTypeCode, bool? noRetired) {

            List<WhereCondition> conditions = [];
            if (artistId.HasValue) { conditions.Add(new("s." + ARTIST_ID, WhereConditionOperator.EQUALS,"@"+ARTIST_ID)); }
            if (commTypeCode.HasValue) { conditions.Add(new(COMM_TYPE_CD)); }
            if (noRetired==true) { conditions.Add(new(RETIRED_IN)); }

            var sql = conditions.Count > 0 ? ServiceRow.Select(new(conditions)) : ServiceRow.Select();
            
            return ServiceRow.ToServices(await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                if (artistId.HasValue) { cmd.SetInt(ARTIST_ID, artistId); }
                if (commTypeCode.HasValue) { cmd.SetInt(COMM_TYPE_CD, commTypeCode); }
                if (noRetired==true) { cmd.SetBoolean(RETIRED_IN,false); }
            }, ServiceRow.RowMapper));
        }

        #endregion

        #region UPDATE

        public async Task Update(string username, Service service) {

            var s = await Get(username, service.Id) ?? throw new InvalidOperationException("Could not find service!");
            var serviceSql = UpdateSql(
                [
                    ARTIST_ID, COMM_TYPE_CD,
                    SERVICE_NM, SERVICE_DESC_TX,
                    SERVICE_BASE_PRICE_NB, SERVICE_CURRENCY_CD
                ],
                SERVICE_TABLE,
                new([new(SERVICE_ID)])
            );

            var newAdditions = service.Additions.Where(a => a.Id < 0).ToList();
            var updatedAdditions = service.Additions.Where(a => a.Dirty).ToList();
            var deletedAdditions = s.Additions.Select(a=>a.Id).Except(service.Additions.Select(a=>a.Id)).ToList();

            await CreateAdditions(service.Id, newAdditions);
            await UpdateAdditions(updatedAdditions);
            await DeleteAdditions(deletedAdditions);

            await adoTemplate.Execute(serviceSql, (cmd) => {
                cmd.SetInt(ARTIST_ID, service.Artist.Id);
                cmd.SetInt(COMM_TYPE_CD, (int)service.CommissionType);
                cmd.SetString(SERVICE_NM, service.Name);
                cmd.SetString(SERVICE_DESC_TX, service.Description);
                cmd.SetInt(SERVICE_BASE_PRICE_NB, service.BasePrice);
                cmd.SetString(SERVICE_CURRENCY_CD, service.Currency);
                cmd.SetInt(SERVICE_ID,service.Id);
            });
        }

        private async Task UpdateAdditions(List<ServiceAddition> additions) {
            var additionsSql = UpdateSql(
              [
                    SERVICE_ADDT_NM, SERVICE_ADDT_DESC_TX,
                    SERVICE_ADDT_PRICE_NB, SERVICE_ADDT_LIMIT_NB
              ],
              SERVICE_ADDITIONS_TABLE,
              new WhereConditionGroup([new(SERVICE_ADDT_ID)])
          );

            await adoTemplate.ExecuteBatch(additionsSql, (cmd, a) => {
                cmd.SetInt(SERVICE_ADDT_ID, a.Id);
                cmd.SetString(SERVICE_ADDT_NM, a.Name);
                cmd.SetString(SERVICE_ADDT_DESC_TX, a.Description);
                cmd.SetInt(SERVICE_ADDT_PRICE_NB, a.Price);
                cmd.SetInt(SERVICE_ADDT_LIMIT_NB, a.Limit);
            }, additions);
        }

        #endregion

        #region DELETE
        public async Task Delete(string username, int id) { 
            var s = await Get(username, id) ?? throw new InvalidOperationException("Could not find service");
            await DeleteAdditions(s.Additions.Select(a => a.Id).ToList());

            var sql = DeleteSql(SERVICE_TABLE, new([new(SERVICE_ID)]));
            await adoTemplate.Execute(sql, (cmd) => cmd.SetInt(SERVICE_ID, id));
        }

        public async Task DeleteAllFromArtist(string username, int artistId) {
            //Delete all the additions
            var services = await GetAll(username, artistId, null,null);
            foreach (var service in services) {
                await DeleteAdditions(service.Additions.Select(a => a.Id).ToList());
            }

            //Delete 
            var sql = DeleteSql(SERVICE_TABLE, new([new(SERVICE_ID)]));
            await adoTemplate.ExecuteBatch(sql, (cmd,a) => cmd.SetInt(SERVICE_ID, a.Id),services);
        }

        private async Task DeleteAdditions(List<int> ids) {
            if (ids.Count == 0) return;

            var sql = DeleteSql(SERVICE_ADDITIONS_TABLE, new([new(
                SERVICE_ADDT_ID,ids    
            )]));

            await adoTemplate.Execute(sql);
        }

        #endregion

    }
}
