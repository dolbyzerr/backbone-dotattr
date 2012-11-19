var song = new Backbone.Model({
    title: "Lucy In The Sky With Diamonds",
    album: new Backbone.Model({
        title: "Sgt. Pepper's Lonely Hearts Club Band",
        release: {
            year: "1987"
        },
        band: new Backbone.Model({
            name: "Beatles"
        })
    })
});

test("get model attribute", function() {
    equal(song.get('title'), "Lucy In The Sky With Diamonds");
    equal(song.get('album.title'), "Sgt. Pepper's Lonely Hearts Club Band");
    equal(song.get('album.release.year'), "1987");
});

test("escape model attribute", function() {
    equal(song.escape('album.title'), "Sgt. Pepper&#x27;s Lonely Hearts Club Band");
});

test("has model attribute", function() {
    ok(song.has('title'));
    ok(song.has('album.title'));
    ok(song.has('album.release.year'));
});

test("has non-existent attributes", function() {
    strictEqual(song.has('notpresent'), false);
    strictEqual(song.has('notpresent.title'), false);
    strictEqual(song.has('notpresent.release.year'), false);
});

test("get non-existent model attribute", function() {
    strictEqual(song.get('notpresent'), undefined);
    strictEqual(song.get('notpresent.title'), undefined);
    strictEqual(song.get('notpresent.release.year'), undefined);
});

test("set simple value", function(){
    ok(song.set("title", "title"));
    equal(song.get("title"), "title");
    ok(song.set("title", "Lucy In The Sky With Diamonds"));
});

test("set simple nested value", function(){
    ok(song.set("album.title", "Experience"));
    equal(song.get("album.title"), "Experience");
    ok(song.set("album.title", "Lucy In The Sky With Diamonds"));
});

test("set simple non-existent value", function(){
    ok(song.set("foo", "bar"));
    equal(song.get("foo"), "bar");
})

test("set deep nested value (nested object)", 3, function(){
    ok(song.set("album.release.year", "2011"));
    equal(song.get("album.release.year"), "2011");
    ok(song.set("album.release.year", "1987"));
});

test("set deep nested value (nested model)", function(){
    song.set("album.band.name", "ABBA");
    equal(song.get("album.band.name"), "ABBA");
    song.set("album.band.name", "Beatles");
});

test("change event on simple set", function(){
    song.on("change:title", function(model, newValue, attributes){
        equal(model, song);
        equal(newValue, "test");
        ok(attributes.changes.title);
    });
    song.set("title", "test");
    song.off();
    song.set("title", "Lucy In The Sky With Diamonds");
});

test("change event on simple nested set", function(){
    // TODO: newValue must be added
    song.on("change:album:title", function(model, attributes){
        equal(model, song.get("album"));
        ok(attributes.changes.title);
    });
    song.set("album.title", "Experience");
    song.off();
    song.set("album.title", "Sgt. Pepper's Lonely Hearts Club Band");
    ok(true);
});

