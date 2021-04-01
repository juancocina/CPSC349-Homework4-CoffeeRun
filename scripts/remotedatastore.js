(function (window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    function RemoteDataStore(url) {
        if(!url) {
            throw new Error('no remote URL supplied');
        }
        this.serverUrl = url;
    }

    RemoteDataStore.prototype.add = function (val) {
        var collection = firebase.firestore().collection('coffee-orders');
        return collection.add(val);
    };

    RemoteDataStore.prototype.getAll = function (renderer) {
        var query = firebase.firestore()
            .collection('coffee-orders')
            .orderBy('CoffeeOrder')
            .limit(100);
        this.getDocumentsInQuery(query, renderer);
    };

    RemoteDataStore.prototype.get = function(key) {
        return firebase.firestore().collection('coffee-orders').doc(key).get();
    };

    RemoteDataStore.prototype.remove = function (key) {
        $.ajax(this.serverUrl + '/' + key, {
            type: 'DELETE'
        });
    };

    RemoteDataStore.prototype.getDocumentsInQuery = function(query, renderer) {
        query.onSnapshot(function(snapshot) {
            if (!snapshot.size) return renderer.empty(); //display "there are no orders"

            snapshot.docChanges().forEach(function(change) {
                if (change.type === 'removed') {
                    renderer.remove(change.doc);
                } else {
                    renderer.display(change.doc);
                }
            });
        });
    };

    App.RemoteDataStore = RemoteDataStore;
    window.App = App;
})(window);