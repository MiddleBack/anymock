/**
 * Created by tanxiangyuan on 16/9/5.
 */

exports.INTERFACE_DEAL_TYPE = {
    DEAL_TYPE_VERSION: 0,
    DEAL_TYPE_URL: 1,
    DEAL_TYPE_DATE: 2
};

exports.URL_DEF = {
    PROJECT_LIST : 'http://localhost:8011/data/projectList.json',
    REMOTE_PROJECT_DEF_PATH : '/api/projects/%s/interfaces'
};

exports.BUSINESS_ERR = {
    INTERFACE_FETCH_EMPTY : 'biz_err_01'
};