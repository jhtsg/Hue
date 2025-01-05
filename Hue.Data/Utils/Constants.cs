namespace Hue.Data.Utils
{
    public static class Constants
    {

        public static readonly string SCHEMA = "hue";

        public static readonly string SESSION_TABLE = $"{SCHEMA}.session";
        public static readonly string SESSION_ID = "session_id";

        public static readonly string USER_TABLE = $"{SCHEMA}.user ";
        public static readonly string USER_NM = "user_nm";
        public static readonly string PASS_TX = "pass_tx";
        public static readonly string SALT_TX = "salt_tx";
        public static readonly string ARTIST_IN = "artist_in";

        public static readonly string ARTIST_TABLE = $"{SCHEMA}.artist";
        public static readonly string ARTIST_ID = "artist_id";
        public static readonly string ARTIST_NM = "artist_nm";
        public static readonly string ARTIST_SOCIAL_TX = "artist_social_tx";
        public static readonly string PAYMENT_URL_TX = "payment_url_tx";
        public static readonly string ARTIST_COMM_SHEET_TX = "artist_comm_sheet_tx";
        public static readonly string ARTIST_IMG_BYTES = "artist_img_bytes";
        public static readonly string ARTIST_IMG_MIME_TX = "artist_img_mime_tx";
        public static readonly string ARTIST_IMG_PRESENT_IN = "artist_img_present_in";

        public static readonly string CHAR_TABLE = $"{SCHEMA}.char";
        public static readonly string CHAR_ID = "char_id";
        public static readonly string CHAR_NM = "char_nm";
        public static readonly string CHAR_SPECIES_TX = "char_species_tx";
        public static readonly string CHAR_DESC_TX = "char_desc_tx";
        public static readonly string CHAR_COLOR_TX = "char_color_tx";
        public static readonly string CHAR_IMG_BYTES = "char_img_bytes";
        public static readonly string CHAR_IMG_MIME_TX = "char_img_mime_tx";
        public static readonly string PRIMARY_CHAR_IN = "primary_char_in";
        public static readonly string CHAR_IMG_PRESENT_IN = "char_img_present_in";

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
        public static readonly string COMM_POST_URL_TX = "comm_post_url_tx";
        public static readonly string COMM_STATUS_CD = "comm_status_cd";
        public static readonly string COMM_TYPE_CD = "comm_type_cd";
        public static readonly string COMM_HEADER_IMG_BYTES = "comm_header_img_bytes";
        public static readonly string COMM_HEADER_IMG_MIME_TYPE = "comm_header_img_mime_tx";
        public static readonly string COMM_YEAR_NB = "comm_year_nb";
        public static readonly string COMM_MONTH_NB = "comm_month_nb";
        public static readonly string COMM_STARTED_IN = "comm_started_in";
        public static readonly string COMM_TTC_NB = "comm_ttc_nb";
        public static readonly string COMM_HEADER_IMG_PRESENT_IN = "comm_header_img_present_in";

        public static readonly string COMM_TAG_TABLE = $"{SCHEMA}.comm_tag";
        public static readonly string COMM_TAG_ID = "comm_tag_id";
        public static readonly string COMM_TAG_NM = "comm_tag_nm";
        public static readonly string COMM_TAG_DESC_TX = "comm_tag_desc_tx";
        public static readonly string COMM_TAG_COLOR_TX = "comm_tag_color_tx";

        public static readonly string COMM_CHAR_MAP = $"{SCHEMA}.comm_char_map";
        public static readonly string COMM_TAG_MAP = $"{SCHEMA}.comm_tag_map";

        public static readonly string AT_A_GLANCE_VIEW = $"{SCHEMA}.AT_A_GLANCE_VIEW";
        public static readonly string YEARLY_AT_A_GLANCE_VIEW = $"{SCHEMA}.YEARLY_AT_A_GLANCE_VIEW";
        public static readonly string TOTAL_COMM_NB        = "total_comm_nb";
        public static readonly string TOTAL_SPENT_NB       = "total_spent_nb";
        public static readonly string TOTAL_NOT_COMM_NB    = "total_not_comm_nb";
        public static readonly string TOTAL_NOT_SPENT_NB   = "total_not_spent_nb";
        public static readonly string AVG_PRICE_NB         = "avg_price_nb";
        public static readonly string AVG_TTC_NB           = "AVG_TTC_NB";
        public static readonly string AVG_SPENT_NB         = "AVG_SPENT_NB";
        public static readonly string AVG_COMM_BY_MONTH_NB = "AVG_COMM_BY_MONTH_NB";

        public static readonly string MONTHLY_COMM_PRICE_CAT_VIEW = $"{SCHEMA}.MONTHLY_COMM_PRICE_CAT_VIEW";
        public static readonly string SMALL_COMM_CNT = "SMALL_COMM_CNT";
        public static readonly string MED_COMM_CNT = "MED_COMM_CNT";
        public static readonly string LARGE_COMM_CNT = "LARGE_COMM_CNT";

        public static readonly string MONTHLY_SPEND_VIEW = $"{SCHEMA}.MONTHLY_SPEND_VIEW";
        public static readonly string CONFIRMED_SPENT_NB = "CONFIRMED_SPENT_NB";
        public static readonly string POTENTIAL_SPENT_NB = "POTENTIAL_SPENT_NB";

        public static readonly string MONTHLY_STATUS_VIEW = $"{SCHEMA}.MONTHLY_STATUS_VIEW";
        public static readonly string BRAINSTORM_CNT = "BRAINSTORM_CNT";
        public static readonly string SCHEDULED_CNT = "SCHEDULED_CNT";
        public static readonly string IN_PROG_CNT = "IN_PROG_CNT";
        public static readonly string DONE_CNT = "DONE_CNT";
        public static readonly string PUBLISH_CNT = "PUBLISH_CNT";

        public static readonly string CHAR_STATISTICS = $"{SCHEMA}.CHAR_STATISTICS";
        public static readonly string YEARLY_CHAR_STATISTICS = $"{SCHEMA}.YEARLY_CHAR_STATISTICS";
        public static readonly string ARTIST_STATISTICS = $"{SCHEMA}.ARTIST_STATISTICS";
        public static readonly string YEARLY_ARTIST_STATISTICS = $"{SCHEMA}.YEARLY_ARTIST_STATISTICS";
        public static readonly string TAG_STATISTICS = $"{SCHEMA}.TAG_STATISTICS";
        public static readonly string YEARLY_TAG_STATISTICS = $"{SCHEMA}.YEARLY_TAG_STATISTICS";

        public static readonly string COMM_CNT = "COMM_CNT";
        public static readonly string SPENT_NB = "SPENT_NB";
        public static readonly string LAST_PBLSH_DT = "LAST_PBLSH_DT";

        public static readonly string OVERDUE_DAYS_NB = "OVERDUE_DAYS_NB";
        public static readonly string OVERDUE_COMMS = "OVERDUE_COMMS";

        public static readonly string CRE_TS = "cre_ts";
        public static readonly string UPDT_TS = "updt_ts";
        public static readonly string START_DT = "start_dt";
        public static readonly string DONE_DT = "done_dt";
        public static readonly string PBLSH_DT = "pblsh_dt";

        public static readonly string RETIRED_IN = "retired_in";
        public static readonly string IMAGE_IN = "image_in";

    }
}
