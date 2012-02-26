// Web platform
//
// Works in Chrome with --disable-web-security
// But, uh, never use that mode for real huh? :)

// @todo need menus!

window.addEventListener('load', function() {
	chrome.initialize();
}, true);

chrome.addPlatformInitializer(function() {
        $('html').removeClass('goodscroll').addClass('badscroll');
});

chrome.doFocusHack =  function()  {
            console.log("in empty doFocusHack.");
        //FIXME: With normal doFocusHack search, location, history, saved pages
            //does not work. (not displayed). (Note that history and saved pages
            //also with this hack only working in simulator)
    }

function setMenuItemState(action, state) {
    // Stupid iterator
    $.each(menu_items, function(i, item) {
        if(item.id == action) {
            item.disabled = !state;
        }
    });
    updateMenuState();
}

function setPageActionsState(state) {
    setMenuItemState("page-actions", state);
}

var menu_items = [
    {
        id: 'go-back',
        action: chrome.goBack
    },
    {
        id: 'go-forward',
        action: chrome.goForward,
        disabled: true
    },
    {
        id: 'read-in',
        action:  languageLinks.showAvailableLanguages
    },
    {
        id: 'page-actions',
        action: function() {
            popupMenu([
                mw.msg('menu-savePage'),
                mw.msg('menu-sharePage'),
                mw.msg('menu-cancel')
            ], function(value, index) {
                if (index == 0) {
                    savedPages.saveCurrentPage();
                } else if (index == 1) {
                    sharePage();
                }
            }, {
                cancelButtonIndex: 2,
                origin: this
            });
        }
    },
    {
        id: 'list-actions',
        action: function() {
            popupMenu([
                mw.msg('menu-nearby'),
                mw.msg('menu-savedPages'),
                mw.msg('menu-history'),
                mw.msg('menu-cancel')
            ], function(val, index) {
                if (index == 0) {
                    geo.showNearbyArticles();
                } else if (index == 1) {
                    savedPages.showSavedPages();
                } else if (index == 2) {
                    appHistory.showHistory();
                }
            }, {
                cancelButtonIndex: 3,
                origin: this
            });
        }
    },
    {
        id: 'view-settings',
        action: appSettings.showSettings
    }
];

function updateMenuState() {
    $('#menu').remove();
    var $menu = $('<div>');
    $menu
        .attr('id', 'menu')
        .appendTo('body');

    $.each(menu_items, function(i, item) {
        var $button = $('<button>');
        $button
            .attr('id', item.id)
            .attr('title', mw.msg(item.id));
        if(item.disabled) {
            $button.addClass("disabled");
        } else {
            $button.click(function() {
                item.action.apply(this);
            });
        }
        $button.append('<span>')
            .appendTo($menu);
    });
};

network.isConnected = function()  {
//    return navigator.network.connection.type == Connection.NONE ? false : true;
    //FIXME
    return true;
}

// @Override
function popupMenu(items, callback, options) {
    options = $.extend({destructiveButtonIndex: null, cancelButtonIndex: null}, options || {});

    var $bg = $('<div class="actionsheet-bg"></div>').appendTo('body'),
        $sheet = $('<div class="actionsheet"></div>').appendTo('body');
    $.each(items, function(index, label) {
        var $button = $('<button>')
            .text(label)
            .appendTo($sheet)
            .click(function() {
                $sheet.remove();
                $bg.remove();
                callback(label, index);
            });
        if (index === options.destructiveButtonIndex) {
            $button.addClass('destructive');
        }
        if (index === options.cancelButtonIndex) {
            $button.addClass('cancel');
        }
    });
}
