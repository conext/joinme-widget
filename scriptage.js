var current_group;
var response;
var dbg;

function clog(message) {
    console.log("Join.me ~> " + message);
}

function decommission_splash() {
    $('#splash').css('display', 'none');
    $('#content').css('display', 'block');
}

function render_empty_feed(group_name) {
    clog("in render_empty_feed()");
    messagebox(
        "No new messages.",
        "There doesn't seem to be anything happening for <span id='ht'>" + group_name + "</span>."
    ); 
}

function messagebox(message, description) {
    decommission_splash();
    $('#feed').hide();
    $('#link').hide();
    $('#messagebox').show();
    $('#mbox_title').text(message);
    $('#mbox_description').html(description);
}

function rssBox(message, description) {
    decommission_splash();
    $('#feed').hide();
    $('#messagebox').show();
    $('#mbox_title').text(message);
    $('#mbox_description').html(description);
}


function showLink(message, description) {
    decommission_splash();
    $('#linkhref').text(message.toUpperCase() + " Mailing List");
    $('#linkhref').attr("href","https://www.jiscmail.ac.uk/cgi-bin/webadmin?A0=" + message)
}

function entry() {
    /* enlarge your widget. satisfy your user. */
    gadgets.window.adjustHeight(295);
    window.addEventListener("message", function(ev) {
        console.log(ev.data);
        if (!ev.data) {
            clog("No group.");
            messagebox('No group selected.', 'Weird, I couldn\'t get your current group.');
        } else if (ev.data != current_group) {
            current_group = ev.data;
            var group_name = ev.data.split(":");
            group_name = group_name[group_name.length-1];
            clog("Your group: " + group_name);
            showLink(group_name);
            $('#divRss').FeedEk({
                FeedUrl : 'https://www.jiscmail.ac.uk/cgi-bin/webadmin?RSS&v=2.0&L=' + group_name,
                MaxCount : 10,
                ShowDesc : false,
                ShowPubDate:true,
                DescCharacterLimit:80,
                TitleLinkTarget:'_blank',
                groupName: group_name
            });
        } else {
            clog("no changes required, same group.");
        }
    });

    top.postMessage("let's go!", top.location.origin);

    $('#create_form').submit(function(e) {
        e.preventDefault();
        var local_name = $('#site_name').val();
        var identifier = $('#identifier').val();
        clog("Will create: " + local_name + " for " + identifier);
        osapi.resources.createResource({
            "groupId": get_current_group(),
            "obj" : {
                "local_name": local_name,
                "uri": "https://join.me/" + identifier
            }
        }).execute(function(res) {
                clog("response I got: ");
                console.log(res);
                var res = $.parseJSON(res.resource);
                console.log(res);
                if (res.outcome == "ok") {
                    render_goto_wp(local_name);
                } else {
                    clog("Not OK.");
                    render_goto_wp(local_name);
                }
            });
    });
}

