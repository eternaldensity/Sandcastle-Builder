/**
 * Created by haiku on 8/19/15.
 */

var GH = {};

// github instance
GH._g = false;

// gist data
GH.fGist = false;
GH.fGistId = false;

// timer stuff
GH.tTime = false;
GH.tId = false;

GH.setup = function(username, password) {
    GH.username = username;
    GH.password = password;

    GH._g = new Github({
        username: GH.username,
        password: GH.password,
        auth: 'basic'
    });

    GH.findSyncGist();
};

GH.teardown = function() {
    GH._g = false;

    GH.fGist = false;
    GH.fGistId = false;

    clearInterval(GH.tId);

    GH.username = null;
    GH.password = null;
};

GH.getExportData = function() {
    Molpy.RefreshExport();
    return document.getElementById('exporttext').value;
};

GH.importDataFromString = function(data) {
    _gaq && _gaq.push(['_trackEvent', 'Import', 'Begin']);
    Molpy.FromNeedlePulledThing(Molpy.BeanishToCuegish(data));
    _gaq && _gaq.push(['_trackEvent', 'Import', 'Complete']);
    Molpy.Save();
};

GH.withAllUserGists = function(cb) {
    GH._g.getUser().userGists(GH.username, function(err, gists) {
        if (!err) {
            cb(gists)
        } else {
            alert('Something went wrong while getting user gists')
        }
    })
};

GH.deleteAllGists = function() {
    GH.withAllUserGists(function(gists) {
            for (var i = 0; i < gists.length; i++) {
                GH._g.getGist(gists[i].id).delete(function(err, res) {
                    if (err) {
                        alert('Something went wrong while deleting gist')
                    }
                })
            }3
        })
};

GH.creteSyncGist = function() {
    var filename = new Date().toString();

    delta = {
        'description': 'sb-sync',
        'files': {
            'initial-save': {
                'content': GH.getExportData()
            }
        }
    };

    GH._g.getGist().create(delta, function(err, res) {
        if (!err) {
            GH.fGistId = res.id;
            GH.fGist = GH._g.getGist(GH.fGistId);
        } else {
            alert('Something wrong')
        }
    })
};

GH.findSyncGist = function() {
    GH.fGist = false;
    GH.fGistId = false;
    // first, search gists for previous file
    GH.withAllUserGists(function(gists) {
        console.log(gists);
        for (var i = 0; i < gists.length; i++) {
            console.log(gists[i]);
            if (gists[i].description == 'sb-sync') {
                console.log('Found!');
                GH.fGistId = gists[i].id;
                GH.fGist = GH._g.getGist(GH.fGistId);
                break;
            }
        }
        if (!GH.fGist) { // if not found, create and assign one
            GH.creteSyncGist();
            console.log('Created!')
        }
    })
};

GH.prepareToSync = function() {
    var filename = new Date().toString();

    GH.syncDelta = {
        'description': 'sb-sync',
        'files': {}
    };

    GH.syncDelta['files'][filename] = {
        'content': GH.getExportData()
    }
};

// Export/Import
// exports data to a new file in a gist each time
GH.exportToCloud = function() {
    if (GH.fGist) {
        GH.prepareToSync();

        GH.fGist.update(GH.syncDelta, function(err, res) {
            if (!err) {
                console.log('Successfully exported!')
            } else {
                console.log('Couldn\'t export save to cloud!')
            }
        })
    } else {
        console.log('No gist currently selected!')
    }
};


// this goes through list of files within a gist and imports data from the latest one
GH.importFromCloud = function() {
    var savefile = false;

    var cmp = Infinity;

    var filenames = [];

    if (GH.fGist) {
        GH.fGist.read(function(err, res) {
            if (!err) {
                for (k in res.files) {
                    filenames.push(k);
                }

                for (var i = 0; i < filenames.length; i++) {
                    if ((new Date(filenames[i])).valueOf()) {
                        console.log(filenames[i]);
                        if ((new Date() - new Date(filenames[i])) < cmp) {
                            cmp = (new Date() - new Date(filenames[i]));
                            savefile = filenames[i];
                        }
                    }
                }

                // if there's no recent backup, get data from first one done
                if (!savefile) {
                    savefile = 'initial-save'
                }

                GH.importDataFromString(res.files[savefile].content);
                console.log('Imported!')
            }
        })
    } else {
        console.log('No gist currently selected!')
    }
};


//GH.createGist = function()