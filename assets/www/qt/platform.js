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

// @Override
function getPhoneGapVersion(callback, error) {
	callback('n/a');
}


// @Override
function popupMenu(items, callback, options) {
    if (options.origin) {
        var $origin = $(options.origin),
            pos = $origin.offset();
        options.left = pos.left;
        options.top = 0; // hack pos.top;
        options.width = $origin.width();
        options.height = $origin.height();
    }
    window.plugins.actionSheet.create('', items, callback, options);
}
