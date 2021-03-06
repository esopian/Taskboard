/**
 * PhaseController
 *
 * @module      ::  Controller
 * @description ::  Contains logic for handling requests.
 */
"use strict";

var async = require("async");

module.exports = {
    /**
     * Project phase edit action.
     *
     * @param   {Request}   req Request object
     * @param   {Response}  res Response object
     */
    edit: function(req, res) {
        var projectId = parseInt(req.param('id'), 10);

        // Fetch project and project phases data async
        async.parallel(
            {
                // Get project data
                project: function(callback) {
                    DataService.getProject(projectId, callback)
                },

                // Get project phases data
                phases: function(callback) {
                    DataService.getPhases({projectId: projectId}, callback)
                }
            },

            /**
             * Main callback function which is called after all parallel jobs are processed.
             *
             * @param   {Error} error   Possible error object
             * @param   {{}}    data    Data object that contains 'project' and 'phases' data
             */
            function(error, data) {
                if (error) {
                    res.send(error.status ? error.status : 500, error.message ? error.message : error);
                } else {
                    data.layout = req.isAjax ? "layout_ajax" : "layout";

                    res.view(data);
                }
            }
        );
    }
};
