/**
 * Project: Total WordPress Theme
 * Description: Initialize all scripts and add custom js
 * Author: WPExplorer
 * Theme URI: http://www.wpexplorer.com
 * Author URI: http://www.wpexplorer.com
 * License: Custom
 * License URI: http://themeforest.net/licenses
 * Version 4.9
 */

var wpex = {};

( function( $ ) {

    'use strict';

    wpex = {

        /**
         * Main init function.
         */
        init : function() {
            this.config();
            this.bindEvents();
        },

        /**
         * Define vars for caching.
         */
        config : function() {

            this.config = {

                // General
                $window                 : $( window ),
                $document               : $( document ),
                $head                   : $( 'head' ),
                $body                   : $( 'body' ),
                $wpAdminBar             : $( '#wpadminbar' ),
                windowWidth             : $( window ).width(),
                windowHeight            : $( window ).height(),
                windowTop               : $( window ).scrollTop(),
                viewportWidth           : '',
                isRetina                : false,
                heightChanged           : false,
                widthChanged            : false,
                isRTL                   : false,
                iLightboxSettings       : {},

                // VC
                vcActive                : false,

                // Mobile
                isMobile                : false,
                mobileMenuStyle         : null,
                mobileMenuToggleStyle   : null,
                mobileMenuBreakpoint    : 960,

                // Main Divs
                $siteWrap               : null,
                $siteMain               : null,

                // Header
                $siteHeader             : null,
                siteHeaderStyle         : null,
                siteHeaderHeight        : 0,
                siteHeaderTop           : 0,
                siteHeaderBottom        : 0,
                verticalHeaderActive    : false,
                hasHeaderOverlay        : false,
                hasStickyHeader         : false,
                stickyHeaderStyle       : null,
                hasStickyMobileHeader   : false,
                hasStickyNavbar         : false,

                // Logo
                $siteLogo               : null,
                siteLogoHeight          : 0,
                siteLogoSrc             : null,

                // Nav
                $siteNavWrap            : null,
                $siteNav                : null,
                $siteNavDropdowns       : null,

                // Local Scroll
                $localScrollTargets     : 'li.local-scroll a, a.local-scroll, .local-scroll-link, .local-scroll-link > a',
                localScrollOffset       : 0,
                localScrollSpeed        : 600,
                localScrollEasing       : 'easeInOutCubic',
                localScrollSections     : [],

                // Topbar
                hasTopBar               : false,
                hasStickyTopBar         : false,
                $stickyTopBar           : null,
                hasStickyTopBarMobile   : false,

                // Footer
                hasFixedFooter          : false

            };

        },

        /**
         * Bind Events.
         */
        bindEvents : function() {
            var self = this;

            /*** Run on Document Ready ***/
            self.config.$document.on( 'ready', function() {
                self.initUpdateConfig();
                self.superfish();
                self.mobileMenu();
                self.navNoClick();
                self.hideEditLink();
                self.menuWidgetAccordion();
                self.inlineHeaderLogo(); // Header 5 logo
                self.menuSearch();
                self.headerCart();
                self.backTopLink();
                self.smoothCommentScroll();
                self.toggleBar();
                self.localScrollLinks();
                self.customSelects();
                self.autoLightbox();
                self.iLightbox();
                self.equalHeights();
                self.archiveMasonryGrids();
                self.overlaysMobileSupport();
                self.ctf7Preloader();
                self.vcAccessability();
            } );

            /*** Run on Window Load ***/
            self.config.$window.on( 'load', function() {

                // Add window loaded css tag to body
                self.config.$body.addClass( 'wpex-window-loaded' );

                // Run methods.
                self.windowLoadUpdateConfig();
                self.megaMenusWidth();
                self.megaMenusTop();
                self.flushDropdownsTop();
                self.sliderPro();
                self.parallax();
                self.stickyTopBar();
                self.vcTabsTogglesJS();
                self.overlayHovers();
                self.headerOverlayOffset(); // Add before sticky header ( important )

                // Sticky Header
                if ( self.config.hasStickyHeader ) {
                    self.stickyHeaderStyle = wpexLocalize.stickyHeaderStyle;
                    if ( 'standard' == self.stickyHeaderStyle || 'shrink' == self.stickyHeaderStyle || 'shrink_animated' == self.stickyHeaderStyle ) {
                        self.stickyHeader();
                    }
                }

                // Run methods after sticky header
                self.stickyHeaderMenu();
                self.footerReveal();  // Footer Reveal => Must run before fixed footer!!!
                self.fixedFooter();
                self.titleBreadcrumbsFix();

                // Set localScrollOffset after site is loaded to make sure it includes dynamic items including sticky elements
                self.config.localScrollOffset = self.parseLocalScrollOffset( 'init' );

                // Scroll to hash (must be last)
                if ( wpexLocalize.scrollToHash ) {
                    window.setTimeout( function() {
                        self.scrollToHash( self );
                    }, parseInt( wpexLocalize.scrollToHashTimeout ) );
                }

            } );

            /*** Run on Window Resize ***/
            self.config.$window.resize( function() {

                // Reset
                self.config.widthChanged  = false;
                self.config.heightChanged = false;

                // Window width change
                if ( self.config.$window.width() != self.config.windowWidth ) {
                    self.config.widthChanged = true;
                    self.widthResizeUpdateConfig();
                }

                // Height changes
                if ( self.config.$window.height() != self.config.windowHeight ) {
                    self.config.windowHeight  = self.config.$window.height(); // update height
                    self.config.heightChanged = true;
                }

            } );

            /*** Run on Window Scroll ***/
            self.config.$window.scroll( function() {

                // Reset
                self.config.$hasScrolled = false;

                // Yes we actually scrolled
                if ( self.config.$window.scrollTop() != self.config.windowTop ) {
                    self.config.$hasScrolled = true;
                    self.config.windowTop = self.config.$window.scrollTop();
                    self.localScrollHighlight();
                }

            } );

            /*** Run on Orientation Change ***/
            self.config.$window.on( 'orientationchange', function() {
                self.widthResizeUpdateConfig();
                self.archiveMasonryGrids();
            } );

        },

        /**
         * Updates config on doc ready.
         */
        initUpdateConfig: function() {
            var self = this;

            self.config.$body.addClass( 'wpex-docready' );

            // Check if VC is enabled
            self.config.vcActive = this.config.$body.hasClass( 'wpb-js-composer' );

            // Get Viewport width
            self.config.viewportWidth = self.viewportWidth();

            // Check if retina
            self.config.isRetina = self.retinaCheck();
            if ( self.config.isRetina ) {
                self.config.$body.addClass( 'wpex-is-retina' );
            }

            // Mobile check & add mobile class to the header
            if ( self.mobileCheck() ) {
                self.config.isMobile = true;
                self.config.$body.addClass( 'wpex-is-mobile-device' );
            }

            // Define wrap
            var $siteWrap = $( '#wrap' );
            if ( $siteWrap ) {
                self.config.$siteWrap = $siteWrap;
            }

            // Define main
            var $siteMain = $( '#main' );
            if ( $siteMain ) {
                self.config.$siteMain = $siteMain;
            }

            // Define header
            var $siteHeader = $( '#site-header' );
            if ( $siteHeader.length ) {
                self.config.siteHeaderStyle = wpexLocalize.siteHeaderStyle;
                self.config.$siteHeader = $( '#site-header' );
            }

            // Define logo
            var $siteLogo = $( '#site-logo img.logo-img' );
            if ( $siteLogo.length ) {
                self.config.$siteLogo = $siteLogo;
                self.config.siteLogoSrc = self.config.$siteLogo.attr( 'src' );
            }

            // Menu Stuff
            var $siteNavWrap = $( '#site-navigation-wrap' );
            if ( $siteNavWrap.length ) {

                // Define menu
                self.config.$siteNavWrap = $siteNavWrap;
                var $siteNav = $( '#site-navigation', $siteNavWrap );
                if ( $siteNav.length ) {
                    self.config.$siteNav = $siteNav;
                }

                // Check if sticky menu is enabled
                if ( wpexLocalize.hasStickyNavbar ) {
                    self.config.hasStickyNavbar = true;
                }

                // Store dropdowns
                var $siteNavDropdowns = $( '.dropdown-menu > .menu-item-has-children > ul', $siteNavWrap );
                if ( $siteNavWrap.length ) {
                    self.config.$siteNavDropdowns = $siteNavDropdowns;
                }

            }

            // Mobile menu settings
            if ( wpexLocalize.hasMobileMenu ) {
                self.config.mobileMenuStyle       = wpexLocalize.mobileMenuStyle;
                self.config.mobileMenuToggleStyle = wpexLocalize.mobileMenuToggleStyle;
                self.config.mobileMenuBreakpoint  = wpexLocalize.mobileMenuBreakpoint;
            }

            // Check if fixed footer is enabled
            if ( self.config.$body.hasClass( 'wpex-has-fixed-footer' ) ) {
                self.config.hasFixedFooter = true;
            }

            // Footer reveal
            self.config.$footerReveal = $( '.footer-reveal-visible' );
            if ( self.config.$footerReveal.length && self.config.$siteWrap && self.config.$siteMain ) {
                self.config.$hasFooterReveal = true;
            }

            // Header overlay
            if ( self.config.$siteHeader && self.config.$body.hasClass( 'has-overlay-header' ) ) {
                self.config.hasHeaderOverlay = true;
            }

            // Top bar enabled
            var $topBarWrap =  $( '#top-bar-wrap' );
            if ( $topBarWrap.length ) {
                self.config.hasTopBar = true;
                if ( $topBarWrap.hasClass( 'wpex-top-bar-sticky' ) ) {
                    self.config.$stickyTopBar = $topBarWrap;
                    if ( self.config.$stickyTopBar.length ) {
                        self.config.hasStickyTopBar = true;
                        self.config.hasStickyTopBarMobile = wpexLocalize.hasStickyTopBarMobile;
                    }
                }
            }

            // Sticky Header => Mobile Check (must check first)
            self.config.hasStickyMobileHeader = wpexLocalize.hasStickyMobileHeader;

            // Check if sticky header is enabled
            if ( self.config.$siteHeader && wpexLocalize.hasStickyHeader ) {
                self.config.hasStickyHeader = true;
            }

            // Vertical header
            if ( this.config.$body.hasClass( 'wpex-has-vertical-header' ) ) {
                self.config.verticalHeaderActive = true;
            }

            // Local scroll speed
            if ( wpexLocalize.localScrollSpeed ) {
                self.config.localScrollSpeed = parseInt( wpexLocalize.localScrollSpeed );
            }

            // Local scroll easing
            if ( wpexLocalize.localScrollEasing ) {
                self.config.localScrollEasing = wpexLocalize.localScrollEasing;
                if ( 'false' == self.config.localScrollEasing ) {
                    self.config.localScrollEasing = 'swing';
                }
            }

            // Get local scrolling sections
            self.config.localScrollSections = self.localScrollSections();

        },

        /**
         * Updates config on window load.
         */
        windowLoadUpdateConfig: function() {

            this.config.windowHeight = this.config.$window.height();

            if ( this.config.$siteHeader ) {
                var siteHeaderTop = this.config.$siteHeader.offset().top;
                this.config.siteHeaderHeight = this.config.$siteHeader.outerHeight();
                this.config.siteHeaderBottom = siteHeaderTop + this.config.siteHeaderHeight;
                this.config.siteHeaderTop = siteHeaderTop;
                if ( this.config.$siteLogo ) {
                    this.config.siteLogoHeight = this.config.$siteLogo.height();
                }
            }

        },

        /**
         * Updates config whenever the window is resized.
         */
        widthResizeUpdateConfig: function() {

            // Update main configs
            this.config.windowHeight  = this.config.$window.height();
            this.config.windowWidth   = this.config.$window.width();
            this.config.windowTop     = this.config.$window.scrollTop();
            this.config.viewportWidth = this.viewportWidth();

            // Update header height
            if ( this.config.$siteHeader ) {
                this.config.siteHeaderHeight = this.config.$siteHeader.outerHeight();
            }

            // Get logo height
            if ( this.config.$siteLogo ) {
                this.config.siteLogoHeight = this.config.$siteLogo.height();
            }

            // Vertical Header
            if ( this.config.windowWidth < 960 ) {
                this.config.verticalHeaderActive = false;
            } else if ( this.config.$body.hasClass( 'wpex-has-vertical-header' ) ) {
                this.config.verticalHeaderActive = true;
            }

            // Local scroll offset => update last
            this.config.localScrollOffset = this.parseLocalScrollOffset( 'resize' );

            // Re-run functions
            this.megaMenusWidth();
            this.overlayHovers();

        },

        /**
         * Retina Check.
         */
        retinaCheck: function() {
            var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
            if ( window.devicePixelRatio > 1 ) {
                return true;
            }
            if ( window.matchMedia && window.matchMedia( mediaQuery ).matches ) {
                return true;
            }
            return false;
        },

        /**
         * Mobile Check.
         */
        mobileCheck: function() {
            if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
                return true;
            }
        },

        /**
         * Viewport width.
         */
        viewportWidth: function() {
            var e = window, a = 'inner';
            if ( ! ( 'innerWidth' in window ) ) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return e[ a+'Width' ];
        },

        /**
         * Superfish menus.
         */
        superfish: function() {

            if ( ! this.config.$siteNav || 'undefined' === typeof $.fn.superfish ) {
                return;
            }

            $( 'ul.sf-menu', this.config.$siteNav ).superfish( {
                delay     : wpexLocalize.superfishDelay,
                speed     : wpexLocalize.superfishSpeed,
                speedOut  : wpexLocalize.superfishSpeedOut,
                cssArrows : false,
                disableHI : false,
                animation   : {
                    opacity : 'show'
                },
                animationOut : {
                    opacity : 'hide'
                }
            } );

        },

         /**
         * MegaMenus Width.
         */
        megaMenusWidth: function() {

            if ( ! wpexLocalize.megaMenuJS || 'one' != this.config.siteHeaderStyle || ! this.config.$siteNavDropdowns || ! this.config.$siteNavWrap.is( ':visible' ) ) {
                return;
            }

            // Define megamenu
            var $megamenu = $( '.megamenu > ul', this.config.$siteNavWrap );

            // Don't do anything if there isn't any megamenu
            if ( ! $megamenu.length ) {
                return;
            }

            var $headerContainerWidth       = this.config.$siteHeader.find( '.container' ).outerWidth(),
                $navWrapWidth               = this.config.$siteNavWrap.outerWidth(),
                $siteNavigationWrapPosition = parseInt( this.config.$siteNavWrap.css( 'right' ) );

            if ( 'auto' == $siteNavigationWrapPosition ) {
                $siteNavigationWrapPosition = 0;
            }

            var $megaMenuNegativeMargin = $headerContainerWidth-$navWrapWidth-$siteNavigationWrapPosition;

            $megamenu.css( {
                'width'       : $headerContainerWidth,
                'margin-left' : -$megaMenuNegativeMargin
            } );

        },

        /**
         * MegaMenus Top Position.
         */
        megaMenusTop: function() {
            var self = this;
            if ( ! self.config.$siteNavDropdowns || 'one' != self.config.siteHeaderStyle ) {
                return;
            }

            var $megamenu = $( '.megamenu > ul', self.config.$siteNavWrap );
            if ( ! $megamenu.length ) return; // Don't do anything if there isn't any megamenu

            function setPosition() {
                if ( self.config.$siteNavWrap.is( ':visible' ) ) {
                    var $headerHeight = self.config.$siteHeader.outerHeight();
                    var $navHeight    = self.config.$siteNavWrap.outerHeight();
                    var $megaMenuTop  = $headerHeight - $navHeight;
                    $megamenu.css( {
                        'top' : $megaMenuTop/2 + $navHeight
                    } );
                }
            }
            setPosition();

            // update on scroll
            this.config.$window.scroll( function() {
                setPosition();
            } );

            // Update on resize
            this.config.$window.resize( function() {
                setPosition();
            } );

            // Update on hover just incase
            $( '.megamenu > a', self.config.$siteNav ).hover( function() {
                setPosition();
            } );

        },

        /**
         * FlushDropdowns top positioning.
         */
        flushDropdownsTop: function() {
            var self = this;
            if ( ! self.config.$siteNavDropdowns || ! self.config.$siteNavWrap.hasClass( 'wpex-flush-dropdowns' ) ) {
                return;
            }

            // Set position
            function setPosition() {
                if ( self.config.$siteNavWrap.is( ':visible' ) ) {
                    var $headerHeight      = self.config.$siteHeader.outerHeight();
                    var $siteNavWrapHeight = self.config.$siteNavWrap.outerHeight();
                    var $dropTop           = $headerHeight - $siteNavWrapHeight;
                    self.config.$siteNavDropdowns.css( 'top', $dropTop/2 + $siteNavWrapHeight );
                }
            }
            setPosition();

            // Update on scroll
            this.config.$window.scroll( function() {
                setPosition();
            } );

            // Update on resize
            this.config.$window.resize( function() {
                setPosition();
            } );

            // Update on hover
            $( '.wpex-flush-dropdowns li.menu-item-has-children > a' ).hover( function() {
                setPosition();
            } );

        },

        /**
         * Mobile Menu.
         */
        mobileMenu: function() {
            if ( 'sidr' == this.config.mobileMenuStyle && typeof wpexLocalize.sidrSource !== 'undefined' ) {
                this.mobileMenuSidr();
            } else if ( 'toggle' == this.config.mobileMenuStyle ) {
                this.mobileMenuToggle();
            } else if ( 'full_screen' == this.config.mobileMenuStyle ) {
                this.mobileMenuFullScreen();
            }
        },

        /**
         * Mobile Menu.
         */
        mobileMenuSidr: function() {
            var self       = this,
                $toggleBtn = $( 'a.mobile-menu-toggle, li.mobile-menu-toggle > a' );

            // Add dark overlay to content
            self.config.$body.append( '<div class="wpex-sidr-overlay wpex-hidden"></div>' );
            var $sidrOverlay = $( '.wpex-sidr-overlay' );

            // Add active class to toggle button
            $toggleBtn.click( function() {
                $( this ).toggleClass( 'wpex-active' );
            } );

            // Add sidr
            $toggleBtn.sidr( {
                name     : 'sidr-main',
                source   : wpexLocalize.sidrSource,
                side     : wpexLocalize.sidrSide,
                displace : wpexLocalize.sidrDisplace,
                speed    : parseInt( wpexLocalize.sidrSpeed ),
                renaming : true,
                bind     : 'click',

                // Callbacks
                onOpen: function() {

                    // Add extra classname
                    $( '#sidr-main' ).addClass( 'wpex-mobile-menu' );

                    // Prevent body scroll
                    if ( wpexLocalize.sidrBodyNoScroll ) {
                        self.config.$body.addClass( 'wpex-noscroll' );
                    }

                    // FadeIn Overlay
                    $sidrOverlay.fadeIn( wpexLocalize.sidrSpeed, function() {
                        $sidrOverlay.addClass( 'wpex-custom-cursor' );
                    } );

                    // Close sidr when clicking on overlay
                    $( '.wpex-sidr-overlay' ).on( 'click', function( event ) {
                        $.sidr( 'close', 'sidr-main' );
                        return false;
                    } );

                },

                onClose: function() {

                    // Remove active class
                    $toggleBtn.removeClass( 'wpex-active' );

                    // Remove body noscroll class
                    if ( wpexLocalize.sidrBodyNoScroll ) {
                        self.config.$body.removeClass( 'wpex-noscroll' );
                    }

                    // FadeOut overlay
                    $sidrOverlay.removeClass( 'wpex-custom-cursor' ).fadeOut( wpexLocalize.sidrSpeed );

                },

                onCloseEnd: function() {

                    // Remove active dropdowns
                    $( '.sidr-class-menu-item-has-children.active' ).removeClass( 'active' ).find( 'ul' ).hide();

                    // Re-trigger stretched rows to prevent issues if browser was resized while
                    // sidr was open
                    if ( 'undefined' !== typeof (window.vc_rowBehaviour) ) {
                        window.vc_rowBehaviour();
                    }

                }

            } );

            // Cache main sidebar var
            var $sidrMain = $( '#sidr-main' );

            // Sidr dropdown toggles
            var $sidrMenu             = $( '.sidr-class-dropdown-menu', $sidrMain ),
                $sidrDropdownTargetEl = $( '.sidr-class-menu-item-has-children > a', $sidrMenu );

            // Add dropdown toggle (arrow)
            $( '.sidr-class-menu-item-has-children', $sidrMenu )
                .children( 'a' )
                .append( '<span class="sidr-class-dropdown-toggle"></span>' );

            // Add toggle click event
            $sidrDropdownTargetEl.on( 'click', function( event ) {

                var $parentEl = $( this ).parent( 'li' );

                if ( ! $parentEl.hasClass( 'active' ) ) {
                    var $allParentLis = $parentEl.parents( 'li' );
                    $( '.sidr-class-menu-item-has-children', $sidrMenu )
                        .not( $allParentLis )
                        .removeClass( 'active' )
                        .children( 'ul' )
                        .stop( true, true )
                        .slideUp( 'fast' );
                    $parentEl.addClass( 'active' ).children( 'ul' ).stop( true, true ).slideDown( 'fast' );
                } else {
                    $parentEl.removeClass( 'active' );
                    $parentEl.find( 'li' ).removeClass( 'active' ); // Remove active from sub-drops
                    $parentEl.find( 'ul' ).stop( true, true ).slideUp( 'fast' );       // Hide all drops
                }

                return false;

            } );

            // Loop through parent items and add to dropdown if they have a link
            var $parents = $( 'li.sidr-class-menu-item-has-children > a', $sidrMenu );

            $parents.each( function() {

                var $this = $( this );

                if ( $this && $this.attr( 'href' ) && '#' != $this.attr( 'href' ) ) {
                    var $parent = $this.parent( 'li' ),
                        el      = $parent.clone();
                    $this.removeAttr( 'data-ls_linkto' );
                    $parent.removeClass( 'sidr-class-local-scroll' );
                    el.removeClass( 'sidr-class-menu-item-has-children sidr-class-dropdown' );
                    el.find( 'a' ).removeClass();
                    el.find( 'ul, .sidr-class-dropdown-toggle' ).remove().end().prependTo( $this.next( 'ul' ) );
                }

            } );

            // Re-name font Icons to correct classnames
            // @todo can we optimize this? Maybe instead of renaming have list of classes to exclude from prefix in sidr.js
            $( "[class*='sidr-class-fa']", $sidrMain ).attr( 'class', function( i, c ) {
                c = c.replace( 'sidr-class-fa', 'fa' );
                c = c.replace( 'sidr-class-fa-', 'fa-' );
                return c;
            } );
            $( "[class*='sidr-class-ticon']", $sidrMain ).attr( 'class', function( i, c ) {
                c = c.replace( 'sidr-class-ticon', 'ticon' );
                c = c.replace( 'sidr-class-ticon-', 'ticon-' );
                return c;
            } );

            // Close sidr when clicking toggle
            $( '.sidr-class-wpex-close > a', $sidrMain ).on( 'click', function( e ) {
                e.preventDefault();
                $.sidr( 'close', 'sidr-main' );
            } );

            // Close on resize past mobile menu breakpoint
            self.config.$window.resize( function() {
                if ( self.config.viewportWidth >= self.config.mobileMenuBreakpoint ) {
                    $.sidr( 'close', 'sidr-main' );
                }
            } );

            // Close sidr when clicking local scroll link
            $( 'li.sidr-class-local-scroll > a', $sidrMain ).click( function() {
                var $hash = this.hash;
                if ( $.inArray( $hash, self.config.localScrollSections ) > -1 ) {
                    $.sidr( 'close', 'sidr-main' );
                    self.scrollTo( $hash );
                    return false;
                }
            } );

            // Remove mobile menu alternative if on page to prevent duplicate links
            if ( $( '#mobile-menu-alternative' ).length ) {
                $( '#mobile-menu-alternative' ).remove();
            }

        },

        /**
         * Toggle Mobile Menu.
         */
        mobileMenuToggle: function() {

            var self                = this,
                $position           = wpexLocalize.mobileToggleMenuPosition,
                $classes            = 'mobile-toggle-nav wpex-mobile-menu wpex-clr wpex-togglep-'+ $position,
                $mobileMenuContents = '',
                $mobileSearch       = $( '#mobile-menu-search' ),
                $appendTo           = self.config.$siteHeader,
                $toggleBtn          = $( 'a.mobile-menu-toggle, li.mobile-menu-toggle > a' );

            // Insert nav in fixed_top mobile menu
            if ( 'fixed_top' == self.config.mobileMenuToggleStyle ) {
                $appendTo = $( '#wpex-mobile-menu-fixed-top' );
                if ( $appendTo.length ) {
                    $appendTo.append( '<nav class="'+ $classes +'" aria-label="Mobile menu"></nav>' );
                }
            }

            // Absolute position
            else if ( 'absolute' == $position ) {
                if ( 'navbar' == self.config.mobileMenuToggleStyle ) {
                    $appendTo = $( '#wpex-mobile-menu-navbar' );
                    if ( $appendTo.length ) {
                        $appendTo.append( '<nav class="'+ $classes +'" aria-label="Mobile menu"></nav>' );
                    }
                } else if ( $appendTo ) {
                    $appendTo.append( '<nav class="'+ $classes +'" aria-label="Mobile menu"></nav>' );
                }
            }

            // Insert afterSelf
            else if ( 'afterself' == $position ) {

                $appendTo = $( '#wpex-mobile-menu-navbar' );

                $( '<nav class="'+ $classes +'" aria-label="Mobile menu"></nav>' ).insertAfter( $appendTo );

            // Normal toggle insert (static)
            } else {
                $( '<nav class="'+ $classes +'" aria-label="Mobile menu"></nav>' ).insertAfter( $appendTo );
            }

            // Store Nav in cache
            var $mobileToggleNav = $( '.mobile-toggle-nav' );

            // Grab all content from menu and add into mobile-toggle-nav element
            if ( $( '#mobile-menu-alternative' ).length ) {
                $mobileMenuContents = $( '#mobile-menu-alternative .dropdown-menu' ).html();
                $( '#mobile-menu-alternative' ).remove();
            } else {
                $mobileMenuContents = $( '.dropdown-menu', self.config.$siteNav ).html();
            }
            $mobileToggleNav.html( '<ul class="mobile-toggle-nav-ul">' + $mobileMenuContents + '</ul>' );

            // Remove all styles
            $( '.mobile-toggle-nav-ul, .mobile-toggle-nav-ul *' ).children().each( function() {
                $( this ).removeAttr( 'style' );
            } );

            // Remove ID's for accessibility reasons
            $( '.mobile-toggle-nav-ul, .mobile-toggle-nav-ul *' ).removeAttr( 'id' );

            // Add classes where needed
            $( '.mobile-toggle-nav-ul' ).addClass( 'container' );

            // Loop through parent items and add to dropdown if they have a link
            var parseDropParents = false;
            if ( ! parseDropParents ) {

                var $parents = $mobileToggleNav.find( 'li.menu-item-has-children > a' );

                $parents.each( function() {

                    var $this = $( this );

                    if ( $this && $this.attr( 'href' ) && '#' != $this.attr( 'href' ) ) {
                        var $parent = $this.parent( 'li' ),
                            el      = $parent.clone();
                        $parent.removeClass( 'local-scroll' );
                        $this.removeAttr( 'data-ls_linkto' );
                        el.removeClass( 'menu-item-has-children' );
                        el.find( 'ul, .wpex-open-submenu' ).remove().end().prependTo( $this.next( 'ul' ) );
                    }

                } );

                parseDropParents = true;

            }

            // Add toggles
            var dropDownParents = $mobileToggleNav.find( '.menu-item-has-children' );

            dropDownParents.children( 'a' ).append( '<span class="wpex-open-submenu" aria-haspopup="true"></span>' );

            // Add toggle click event
            var $dropdownTargetEl = $( '.menu-item-has-children > a', $mobileToggleNav );
            $dropdownTargetEl.on( 'click', function( event ) {

                var $parentEl = $( this ).parent( 'li' );

                if ( ! $parentEl.hasClass( 'active' ) ) {
                    var $allParentLis = $parentEl.parents( 'li' );
                    $( '.menu-item-has-children', $mobileToggleNav )
                        .not( $allParentLis )
                        .removeClass( 'active' )
                        .children( 'ul' )
                        .stop( true, true )
                        .slideUp( 'fast' );
                    $parentEl.addClass( 'active' ).children( 'ul' ).stop( true, true ).slideDown( 'fast' );
                } else {
                    $parentEl.removeClass( 'active' );
                    $parentEl.find( 'li' ).removeClass( 'active' ); // Remove active from sub-drops
                    $parentEl.find( 'ul' ).stop( true, true ).slideUp( 'fast' );       // Hide all drops
                }

                return false;

            } );

            // On Show
            function openToggle( $button ) {
                if ( wpexLocalize.animateMobileToggle ) {
                    $mobileToggleNav.stop( true, true ).slideDown( 'fast' ).addClass( 'visible' );
                } else {
                    $mobileToggleNav.addClass( 'visible' );
                }
                $button.addClass( 'wpex-active' );
            }

            // On Close
            function closeToggle( $button ) {
                if ( wpexLocalize.animateMobileToggle ) {
                    $mobileToggleNav.stop( true, true ).slideUp( 'fast' ).removeClass( 'visible' );
                } else {
                    $mobileToggleNav.removeClass( 'visible' );
                }
                $mobileToggleNav.find( 'li.active > ul' ).stop( true, true ).slideUp( 'fast' );
                $mobileToggleNav.find( '.active' ).removeClass( 'active' );
                $button.removeClass( 'wpex-active' );
            }

            // Show/Hide
            $toggleBtn.on( 'click', function( e ) {
                if ( $mobileToggleNav.hasClass( 'visible' ) ) {
                    closeToggle( $( this ) );
                } else {
                    openToggle( $( this ) );
                }
                return false;
            } );

            // Close on resize
            self.config.$window.resize( function() {
                if ( self.config.viewportWidth >= self.config.mobileMenuBreakpoint && $mobileToggleNav.hasClass( 'visible' ) ) {
                    closeToggle( $toggleBtn );
                }
            } );

            // Add search to toggle menu
            if ( $mobileSearch.length ) {
                $mobileToggleNav.append( '<div class="mobile-toggle-nav-search container"></div>' );
                $( '.mobile-toggle-nav-search' ).append( $mobileSearch );
            }

        },

        /**
         * Overlay Mobile Menu.
         */
        mobileMenuFullScreen: function() {
            var self          = this,
                $style        = wpexLocalize.fullScreenMobileMenuStyle ? wpexLocalize.fullScreenMobileMenuStyle : false, // prevent undefined class
                $mobileSearch = $( '#mobile-menu-search' ),
                $menuHTML     = '';

            // Insert new nav
            self.config.$body.append( '<div class="full-screen-overlay-nav wpex-mobile-menu wpex-clr ' + $style + '"><button class="full-screen-overlay-nav-close">&times;</button><nav class="full-screen-overlay-nav-ul-wrapper"><ul class="full-screen-overlay-nav-ul"></ul></nav></div>' );

            var $navUL = $( '.full-screen-overlay-nav-ul' );

            // Grab all content from menu and add into mobile-toggle-nav element
            if ( $( '#mobile-menu-alternative' ).length ) {
                $menuHTML = $( '#mobile-menu-alternative .dropdown-menu' ).html();
                $( '#mobile-menu-alternative' ).remove();
            } else {
                $menuHTML = $( '#site-navigation .dropdown-menu' ).html();
            }
            $navUL.html( $menuHTML );

            // Cache elements
            var $nav        = $( '.full-screen-overlay-nav' );
            var $menuButton = $( '.mobile-menu-toggle' );

            // Add initial aria attributes
            $nav.attr( 'aria-expanded', 'false' );

            // Remove all styles
            $( '.full-screen-overlay-nav, .full-screen-overlay-nav *' ).children().each( function() {
                $( this ).removeAttr( 'style' );
                $( this ).removeAttr( 'id' );
            } );

            // Loop through parent items and add to dropdown if they have a link
            var parseDropParents = false;
            if ( ! parseDropParents ) {

                var $parents = $nav.find( 'li.menu-item-has-children > a' );

                $parents.each( function() {

                    var $this = $( this );

                    if ( $this && $this.attr( 'href' ) && '#' != $this.attr( 'href' ) ) {
                        var $parent = $this.parent( 'li' ),
                            el      = $parent.clone();
                        $parent.removeClass( 'local-scroll' );
                        $this.removeAttr( 'data-ls_linkto' );
                        el.removeClass( 'menu-item-has-children' );
                        el.find( 'ul' ).remove().end().prependTo( $this.next( 'ul' ) );
                    }

                } );

                parseDropParents = true;

            }

            // Add toggle click event
            var $dropdownTargetEl = $nav.find( 'li.menu-item-has-children > a' );
            $dropdownTargetEl.on( 'click', function( event ) {

                var $parentEl = $( this ).parent( 'li' );

                if ( ! $parentEl.hasClass( 'wpex-active' ) ) {
                    var $allParentLis = $parentEl.parents( 'li' );
                    $nav.find( '.menu-item-has-children' )
                        .not( $allParentLis )
                        .removeClass( 'wpex-active' )
                        .children( 'ul' )
                        .stop( true, true )
                        .slideUp( 'fast' );
                    $parentEl.addClass( 'wpex-active' ).children( 'ul' ).stop( true, true ).slideDown( {
                        duration: 'normal',
                        easing: 'easeInQuad'
                    } );
                } else {
                    $parentEl.removeClass( 'wpex-active' );
                    $parentEl.find( 'li' ).removeClass( 'wpex-active' ); // Remove active from sub-drops
                    $parentEl.find( 'ul' ).stop( true, true ).slideUp( 'fast' ); // Hide all drops
                }

                // Return false
                return false;

            } );

            // Show
            $menuButton.on( 'click', function() {

                // Add visible class
                $nav.addClass( 'visible' );

                if ( $nav.hasClass( 'visible' ) ) {

                    // Add no scroll to browser window
                    self.config.$body.addClass( 'wpex-noscroll' );

                    // Set up focusable vars for menu.
                    var focusableNavItems, firstFocusableNavItem, lastFocusableNavItem;

                    // Get all, first and last focusable elements from the Menu.
                    focusableNavItems     = $nav.find( 'select, input, textarea, button, a' ).filter( ':visible' );
                    firstFocusableNavItem = focusableNavItems.first();
                    lastFocusableNavItem  = focusableNavItems.last();

                    // Add initial focus
                    var $transitionDuration = $nav.css( 'transition-duration' );
                    $transitionDuration = $transitionDuration.replace( 's', '' ) * 1000;
                    if ( $transitionDuration ) {
                        setTimeout( function() {
                            firstFocusableNavItem.focus();
                        }, $transitionDuration );
                    }

                    // Redirect last tab to first input.
                    lastFocusableNavItem.on( 'keydown', function ( e ) {
                        if ( ( e.keyCode === 9 && !e.shiftKey ) ) {
                            e.preventDefault();
                            firstFocusableNavItem.focus(); // Set focus on first element - that's actually close button.
                        }
                    } );

                    // Redirect first shift+tab to last input.
                    firstFocusableNavItem.on( 'keydown', function ( e ) {
                        if ( ( e.keyCode === 9 && e.shiftKey ) ) {
                            e.preventDefault();
                            lastFocusableNavItem.focus(); // Set focus on last element.
                        }
                    } );

                    // Toggle aria
                    $nav.attr( 'aria-expanded', 'true' );

                }

                // Return false on button click
                return false;

            } );

            // Hide actions
            function onHide() {
                $nav.removeClass( 'visible' );
                $nav.attr( 'aria-expanded', 'false' );
                $nav.find( 'li.wpex-active > ul' ).stop( true, true ).slideUp( 'fast' );
                $nav.find( '.wpex-active' ).removeClass( 'wpex-active' );
                self.config.$body.removeClass( 'wpex-noscroll' );
            }

            // Hide overlay when clicking local scroll links
            $( '.local-scroll > a', $nav ).click( function() {
                var $hash = this.hash;
                if ( $.inArray( $hash, self.config.localScrollSections ) > -1 ) {
                    onHide();
                    return false;
                }
            } );

            // Hide when clicking close button
            $( '.full-screen-overlay-nav-close' ).on( 'click', function() {
                onHide();
                $menuButton.focus();
                return false;
            } );

            // Hide when clicking escape
            $( document ).keyup( function( event ) {
                if ( event.keyCode == 27 ) {
                    if ( $nav.hasClass( 'visible' ) ) {
                        onHide();
                        $menuButton.focus();
                    }
                }
            } );

            // Add search to toggle menu
            if ( $mobileSearch.length ) {
                $navUL.append( $mobileSearch );
                $( '#mobile-menu-search' ).wrap( '<li class="wpex-search"></li>' );
            }

        },

        /**
         * Prevent clickin on links.
         */
        navNoClick: function() {
            $( 'li.nav-no-click > a, li.sidr-class-nav-no-click > a' ).on( 'click', function() {
                return false;
            } );
        },

        /**
         * Header Search.
         */
        menuSearch: function() {
            var self      = this;
            var $toggleEl = '';
            var $wrapEl   = $( '.header-searchform-wrap' );

            // Alter search placeholder & autocomplete
            if ( $wrapEl.length ) {
                if ( $wrapEl.data( 'placeholder' ) ) {
                    $wrapEl.find( 'input[type="search"]' ).attr( 'placeholder', $wrapEl.data( 'placeholder' ) );
                }
                if ( $wrapEl.data( 'disable-autocomplete' ) ) {
                    $wrapEl.find( 'input[type="search"]' ).attr( 'autocomplete', 'off' );
                }
            }

            /**** Menu Search > Dropdown ****/
            if ( 'drop_down' == wpexLocalize.menuSearchStyle ) {

                $toggleEl = $( 'a.search-dropdown-toggle, a.mobile-menu-search' );
                var $searchDropdownForm = $( '#searchform-dropdown' );

                $toggleEl.click( function( event ) {

                    // Display search form
                    $searchDropdownForm.toggleClass( 'show' );

                    // Active menu item
                    $( this ).parent( 'li' ).toggleClass( 'active' );

                    // Focus
                    var $transitionDuration = $searchDropdownForm.css( 'transition-duration' );
                    $transitionDuration = $transitionDuration.replace( 's', '' ) * 1000;
                    if ( $transitionDuration ) {
                        setTimeout( function() {
                            $searchDropdownForm.find( 'input[type="search"]' ).focus();
                        }, $transitionDuration );
                    }

                    // Hide other things
                    $( 'div#current-shop-items-dropdown' ).removeClass( 'show' );
                    $( 'li.toggle-header-cart' ).removeClass( 'active' );

                    // Return false
                    return false;

                } );

                // Close on doc click
                self.config.$document.on( 'click', function( event ) {
                    if ( ! $( event.target ).closest( '#searchform-dropdown.show' ).length ) {
                        $toggleEl.parent( 'li' ).removeClass( 'active' );
                        $searchDropdownForm.removeClass( 'show' );
                    }
                } );

            }

            /**** Menu Search > Overlay Modal ****/
            else if ( 'overlay' == wpexLocalize.menuSearchStyle ) {

                $toggleEl = $( 'a.search-overlay-toggle, a.mobile-menu-search, li.search-overlay-toggle > a' );
                var $overlayEl = $( '#wpex-searchform-overlay' );
                var $inner = $overlayEl.find( '.wpex-inner' );

                $toggleEl.on( 'click', function( event ) {
                    $overlayEl.toggleClass( 'active' );
                    $overlayEl.find( 'input[type="search"]' ).val( '' );
                    if ( $overlayEl.hasClass( 'active' ) ) {
                        var $overlayElTransitionDuration = $overlayEl.css( 'transition-duration' );
                        $overlayElTransitionDuration = $overlayElTransitionDuration.replace( 's', '' ) * 1000;
                        setTimeout( function() {
                            $overlayEl.find( 'input[type="search"]' ).focus();
                        }, $overlayElTransitionDuration );
                    }
                    return false;
                } );

                // Close searchforms
                $inner.click( function( event ) {
                    event.stopPropagation();
                } );
                $overlayEl.click( function() {
                    $overlayEl.removeClass( 'active' );
                } );

            }

            /**** Menu Search > Header Replace ****/
            else if ( 'header_replace' == wpexLocalize.menuSearchStyle ) {

                $toggleEl = $( 'a.search-header-replace-toggle, a.mobile-menu-search' );
                var $headerReplace = $( '#searchform-header-replace' );

                // Show
                $toggleEl.click( function( event ) {

                    // Display search form
                    $headerReplace.toggleClass( 'show' );

                    // Focus
                    var $transitionDuration = $headerReplace.css( 'transition-duration' );
                    $transitionDuration = $transitionDuration.replace( 's', '' ) * 1000;
                    if ( $transitionDuration ) {
                        setTimeout( function() {
                            $headerReplace.find( 'input[type="search"]' ).focus();
                        }, $transitionDuration );
                    }

                    // Return false
                    return false;

                } );

                // Close on click
                $( '#searchform-header-replace-close' ).click( function() {
                    $headerReplace.removeClass( 'show' );
                    return false;
                } );

                // Close on doc click
                self.config.$document.on( 'click', function( event ) {
                    if ( ! $( event.target ).closest( $( '#searchform-header-replace.show' ) ).length ) {
                        $headerReplace.removeClass( 'show' );
                    }
                } );
            }

        },

        /**
         * Header Cart.
         */
        headerCart: function() {

            if ( $( 'a.wcmenucart' ).hasClass( 'go-to-shop' ) ) {
                return;
            }

            var $toggle = 'a.toggle-cart-widget, li.toggle-cart-widget > a, li.toggle-header-cart > a';

            if ( ! $( $toggle.length ) ) {
                return;
            }

            // Drop-down
            if ( 'drop_down' == wpexLocalize.wooCartStyle ) {

                var $dropdown = $( 'div#current-shop-items-dropdown' );

                // Display cart dropdown
                $( 'body' ).on( 'click', $toggle, function() {
                    $( '#searchform-dropdown' ).removeClass( 'show' );
                    $( 'a.search-dropdown-toggle' ).parent( 'li' ).removeClass( 'active' );
                    $dropdown.toggleClass( 'show' );
                    $( this ).toggleClass( 'active' );
                    return false;
                } );

                // Hide cart dropdown
                $dropdown.click( function( e ) {
                    if ( ! $( e.target ).is( 'a.remove_from_cart_button' ) ) {
                        e.stopPropagation();
                    }
                } );

                this.config.$document.click( function( e ) {
                    if ( ! $( e.target ).is( 'a.remove_from_cart_button' ) ) {
                        $dropdown.removeClass( 'show' );
                        $( $toggle ).removeClass( 'active' );
                    }
                } );

            }

            // Modal
            else if ( 'overlay' == wpexLocalize.wooCartStyle ) {

                var $overlayEl = $( '#wpex-cart-overlay' );
                var $inner     = $overlayEl.find( '.wpex-inner' );

                $( 'body' ).on( 'click', $toggle, function() {
                    $overlayEl.toggleClass( 'active' );
                    return false;
                } );

                // Close searchforms
                $inner.click( function( e ) {
                    if ( ! $( e.target ).is( 'a.remove_from_cart_button' ) ) {
                        event.stopPropagation();
                    }
                } );
                $overlayEl.click( function( e ) {
                    if ( ! $( e.target ).is( 'a.remove_from_cart_button' ) ) {
                        $overlayEl.removeClass( 'active' );
                    }
                } );

            }

        },

        /**
         * Automatically add padding to row to offset header.
         */
        headerOverlayOffset: function() {
            var $offset_element = $( '.add-overlay-header-offset' );
            if ( $offset_element.length ) {
                var self = this;
                var $height = self.config.siteHeaderHeight;
                if ( ! $height ) return;
                var $offset = $( '<div class="overlay-header-offset-div" style="height:'+ $height +'px"></div>' );
                $offset_element.prepend( $offset );
                self.config.$window.resize( function() {
                    $offset.css( 'height', self.config.siteHeaderHeight );
                } );
            }
        },

        /**
         * Hide post edit link.
         */
        hideEditLink: function() {
            $( 'a.hide-post-edit', $( '#content' ) ).click( function() {
                $( 'div.post-edit' ).hide();
                return false;
            } );
        },

        /**
         * Custom menu widget accordion.
         */
        menuWidgetAccordion: function() {

            if ( ! wpexLocalize.menuWidgetAccordion ) {
                return;
            }

            var self = this;

            // Open toggle for active page
            $( '#sidebar .widget_nav_menu .current-menu-ancestor, .widget_nav_menu_accordion .widget_nav_menu .current-menu-ancestor', self.config.$siteMain ).addClass( 'active' ).children( 'ul' ).show();

            // Toggle items
            $( '#sidebar .widget_nav_menu, .widget_nav_menu_accordion  .widget_nav_menu', self.config.$siteMain ).each( function() {
                var $hasChildren = $( this ).find( '.menu-item-has-children' );
                $hasChildren.each( function() {
                    $( this ).addClass( 'parent' );
                    var $links = $( this ).children( 'a' );
                    $links.on( 'click', function( event ) {
                        var $linkParent = $( this ).parent( 'li' );
                        var $allParents = $linkParent.parents( 'li' );
                        if ( ! $linkParent.hasClass( 'active' ) ) {
                            $hasChildren.not( $allParents ).removeClass( 'active' ).children( '.sub-menu' ).slideUp( 'fast' );
                            $linkParent.addClass( 'active' ).children( '.sub-menu' ).stop( true, true ).slideDown( 'fast' );
                        } else {
                            $linkParent.removeClass( 'active' ).children( '.sub-menu' ).stop( true, true ).slideUp( 'fast' );
                        }
                        return false;
                    } );
                } );
            } );

        },

        /**
         * Header 5 - Inline Logo.
         */
        inlineHeaderLogo: function() {
            var self = this;

            // For header 5 only
            if ( 'five' != self.config.siteHeaderStyle ) {
                return;
            }

            // Define vars
            var $headerLogo        = $( '#site-header-inner > .header-five-logo', self.config.$siteHeader );
            var $headerNav         = $( '.navbar-style-five', self.config.$siteHeader );
            var $navLiCount        = $headerNav.children( '#site-navigation' ).children( 'ul' ).children( 'li' ).size();
            var $navBeforeMiddleLi = Math.round( $navLiCount / 2 ) - parseInt( wpexLocalize.headerFiveSplitOffset );

            // Insert Logo into Menu
            function onInit() {

                if ( ( self.config.viewportWidth > self.config.mobileMenuBreakpoint ) && $headerLogo.length && $headerNav.length ) {
                    $( '<li class="menu-item-logo"></li>' ).insertAfter( $headerNav.find( '#site-navigation > ul > li:nth( '+ $navBeforeMiddleLi +' )' ) );
                    $headerLogo.appendTo( $headerNav.find( '.menu-item-logo' ) );
                }

                $headerLogo.addClass( 'display' );

            }

            // Move logo
            function onResize() {

                var $centeredLogo = $( '.menu-item-logo .header-five-logo' );

                if ( self.config.viewportWidth <= self.config.mobileMenuBreakpoint ) {
                    if ( $centeredLogo.length ) {
                        $centeredLogo.prependTo( $( '#site-header-inner' ) );
                        $( '.menu-item-logo' ).remove();
                    }
                } else if ( ! $centeredLogo.length ) {
                    onInit(); // Insert logo to menu
                }
            }

            // On init
            onInit();

            // Move logo on resize
            self.config.$window.resize( function() {
                onResize();
            } );

        },

        /**
         * Back to top link.
         */
        backTopLink: function() {
            var self           = this;
            var $scrollTopLink = $( 'a#site-scroll-top' );

            if ( $scrollTopLink.length ) {

                var $speed  = wpexLocalize.scrollTopSpeed ? parseInt( wpexLocalize.scrollTopSpeed ) : 1000;
                var $offset = wpexLocalize.scrollTopOffset ? parseInt( wpexLocalize.scrollTopOffset ) : 100;

                self.config.$window.scroll( function() {
                    if ( $( this ).scrollTop() > $offset ) {
                        $scrollTopLink.addClass( 'show' );
                    } else {
                        $scrollTopLink.removeClass( 'show' );
                    }
                } );

                $scrollTopLink.on( 'click', function( event ) {
                    $( 'html, body' ).stop( true, true ).animate( {
                        scrollTop : 0
                    }, $speed, self.config.localScrollEasing );
                    return false;
                } );

            }

        },

        /**
         * Smooth Comment Scroll.
         */
        smoothCommentScroll: function() {
            var self = this;
            $( '.single li.comment-scroll a' ).click( function( event ) {
                var $target = $( '#comments' );
                var $offset = $target.offset().top - self.config.localScrollOffset - 20;
                self.scrollTo( $target, $offset );
                return false;
            } );
        },

        /**
         * Togglebar toggle.
         */
        toggleBar: function() {

            var self           = this;
            var $toggleBarWrap = $( '#toggle-bar-wrap' );

            if ( ! $toggleBarWrap.length ) {
                return;
            }

            var $toggleBtn     = $( 'a.toggle-bar-btn, a.togglebar-toggle, .togglebar-toggle > a' );
            var $toggleBtnIcon = $toggleBtn.find( '.ticon' );

            $toggleBtn.on( 'click', function( event ) {
                if ( $toggleBtnIcon.length ) {
                    $toggleBtnIcon.toggleClass( $toggleBtn.data( 'icon' ) );
                    $toggleBtnIcon.toggleClass( $toggleBtn.data( 'icon-hover' ) );
                }
                $toggleBarWrap.toggleClass( 'active-bar' );
                return false;
            } );

            // Close on doc click
            self.config.$document.on( 'click', function( event ) {
                if ( ( $toggleBarWrap.hasClass( 'active-bar' )
                    && $toggleBarWrap.hasClass( 'close-on-doc-click' ) )
                    && ! $( event.target ).closest( '#toggle-bar-wrap' ).length
                ) {
                    $toggleBarWrap.removeClass( 'active-bar' );
                    if ( $toggleBtnIcon.length ) {
                        $toggleBtnIcon.removeClass( $toggleBtn.data( 'icon-hover' ) ).addClass( $toggleBtn.data( 'icon' ) );
                    }
                }
            } );

        },

        /**
         * Sliders
         */
        sliderPro: function( $context ) {
            if ( 'undefined' === typeof $.fn.sliderPro ) {
                return;
            }

            function dataValue( name, fallback ) {
                return ( typeof name !== 'undefined' ) ? name : fallback;
            }

            function getTallestEl( el ) {
                var tallest;
                var first = 1;
                el.each( function() {
                    var $this = $( this );
                    if ( first == 1 ) {
                        tallest = $this;
                        first = 0;
                    } else {
                        if ( tallest.height() < $this.height()) {
                            tallest = $this;
                        }
                    }
                } );
                return tallest;
            }

            // Loop through each slider
            $( '.wpex-slider', $context ).each( function() {

                // Declare vars
                var $slider = $( this );
                var $data   = $slider.data();
                var $slides = $slider.find( '.sp-slide' );

                // Lets show things that were hidden to prevent flash
                $slider.find( '.wpex-slider-slide, .wpex-slider-thumbnails.sp-thumbnails,.wpex-slider-thumbnails.sp-nc-thumbnails' ).css( {
                    'opacity' : 1,
                    'display' : 'block'
                } );

                // Main checks
                var $autoHeight              = dataValue( $data.autoHeight, true );
                var $preloader               = $slider.prev( '.wpex-slider-preloaderimg' );
                var $height                  = ( $preloader.length && $autoHeight ) ? $preloader.outerHeight() : null;
                var $heightAnimationDuration = dataValue( $data.heightAnimationDuration, 600 );
                var $loop                    = dataValue( $data.loop, false );
                var $autoplay                = dataValue( $data.autoPlay, true );

                // Get height based on tallest item if autoHeight is disabled
                if ( ! $autoHeight && $slides.length ) {
                    var $tallest = getTallestEl( $slides );
                    $height = $tallest.height();
                }

                // TouchSwipe
                var $touchSwipe = true;

                if ( typeof $data.touchSwipeDesktop !== 'undefined'
                    && ! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent )
                ) {
                    $touchSwipe = false;
                }

                // Run slider
                $slider.sliderPro( {

                    //supportedAnimation      : 'JavaScript', //(CSS3 2D, CSS3 3D or JavaScript)
                    aspectRatio             : -1,
                    width                   : '100%',
                    height                  : $height,
                    responsive              : true,
                    fade                    : dataValue( $data.fade, 600 ),
                    fadeDuration            : dataValue( $data.animationSpeed, 600 ),
                    slideAnimationDuration  : dataValue( $data.animationSpeed, 600 ),
                    autoHeight              : $autoHeight,
                    heightAnimationDuration : parseInt( $heightAnimationDuration ),
                    arrows                  : dataValue( $data.arrows, true ),
                    fadeArrows              : dataValue( $data.fadeArrows, true ),
                    autoplay                : $autoplay,
                    autoplayDelay           : dataValue( $data.autoPlayDelay, 5000 ),
                    buttons                 : dataValue( $data.buttons, true ),
                    shuffle                 : dataValue( $data.shuffle, false ),
                    orientation             : dataValue( $data.direction, 'horizontal' ),
                    loop                    : $loop,
                    keyboard                : dataValue( $data.keyboard, false ),
                    fullScreen              : dataValue( $data.fullscreen, false ),
                    slideDistance           : dataValue( $data.slideDistance, 0 ),
                    thumbnailsPosition      : 'bottom',
                    thumbnailHeight         : dataValue( $data.thumbnailHeight, 70 ),
                    thumbnailWidth          : dataValue( $data.thumbnailWidth, 70 ),
                    thumbnailPointer        : dataValue( $data.thumbnailPointer, false ),
                    updateHash              : dataValue( $data.updateHash, false ),
                    touchSwipe              : $touchSwipe,
                    thumbnailArrows         : false,
                    fadeThumbnailArrows     : false,
                    thumbnailTouchSwipe     : true,
                    fadeCaption             : dataValue( $data.fadeCaption, true ),
                    captionFadeDuration     : 600,
                    waitForLayers           : true,
                    autoScaleLayers         : true,
                    forceSize               : dataValue( $data.forceSize, 'false' ),
                    reachVideoAction        : dataValue( $data.reachVideoAction, 'playVideo' ),
                    leaveVideoAction        : dataValue( $data.leaveVideoAction, 'pauseVideo' ),
                    endVideoAction          : dataValue( $data.leaveVideoAction, 'nextSlide' ),
                    fadeOutPreviousSlide    : true, // If disabled testimonial/content slides are bad
                    autoplayOnHover         : dataValue( $data.autoplayOnHover, 'pause' ),
                    init: function( event ) {
                        $slider.prev( '.wpex-slider-preloaderimg' ).remove();
                    },
                    gotoSlide: function( event ) {
                        if ( ! $loop && $autoplay && event.index === $slider.find( '.sp-slide' ).length - 1 ) {
                            $slider.data( 'sliderPro' ).stopAutoplay();
                        }
                    }
                } );

            } );

            // WooCommerce: Prevent clicking on Woo entry slider
            $( '.woo-product-entry-slider' ).click( function() {
                return false;
            } );

        },

        /**
         * Advanced Parallax.
         */
        parallax: function( $context ) {
            $( '.wpex-parallax-bg', $context ).each( function() {
                var $this = $( this );
                $this.scrolly2().trigger( 'scroll' );
                $this.css( {
                    'opacity' : 1
                } );
            } );
        },

        /**
         * Local Scroll Offset.
         */
        parseLocalScrollOffset: function( instance ) {
            var self    = this;
            var $offset = 0;

            // Array of items to check
            var items = '.wpex-ls-offset, #wpadminbar, #top-bar-wrap-sticky-wrapper.wpex-can-sticky, #vcex-navbar-sticky-sticky-wrapper.wpex-can-sticky, #site-navigation-sticky-wrapper.wpex-can-sticky, #wpex-mobile-menu-fixed-top, .vcex-navbar-sticky';

            // Return custom offset
            if ( wpexLocalize.localScrollOffset ) {
                return wpexLocalize.localScrollOffset;
            }

            // Adds extra offset via filter
            if ( wpexLocalize.localScrollExtraOffset ) {
                $offset = parseInt( $offset ) + parseInt( wpexLocalize.localScrollExtraOffset );
            }

            // Fixed header
            if ( self.config.hasStickyHeader ) {

                // Return 0 for small screens if mobile fixed header is disabled
                if ( ! self.config.hasStickyMobileHeader && self.config.windowWidth <= wpexLocalize.stickyHeaderBreakPoint ) {
                    $offset = parseInt( $offset ) + 0;
                }

                // Return header height
                else {

                    // Shrink header
                    if ( self.config.$siteHeader.hasClass( 'shrink-sticky-header' ) ) {
                        if ( 'init' == instance || self.config.$siteHeader.is( ':visible' ) ) {
                            $offset = parseInt( $offset ) + parseInt( wpexLocalize.shrinkHeaderHeight );
                        }
                    }

                    // Standard header
                    else {
                        $offset = parseInt( $offset ) + parseInt( self.config.siteHeaderHeight );
                    }

                }

            }

            // Loop through extra items
            $( items ).each( function() {
                var $this = $( this );
                if ( $this.length && $this.is( ':visible' ) ) {
                    $offset = parseInt( $offset ) + parseInt( $this.outerHeight() );
                }
            } );

            // Add 1 extra decimal to prevent cross browser rounding issues (mostly firefox)
            $offset = $offset ? $offset - 1 : 0;

            // Return offset
            return $offset;

        },

        /**
         * Scroll to function.
         */
        scrollTo: function( hash, offset, callback ) {

            // Hash is required
            if ( ! hash ) {
                return;
            }

            // Define important vars
            var self          = this;
            var $target       = null;
            var $page         = $( 'html, body' );
            var $isLsDataLink = false;

            // Check for target in data attributes
            var $lsTarget = $( '[data-ls_id="'+ hash +'"]' );

            if ( $lsTarget.length ) {
                $target       = $lsTarget;
                $isLsDataLink = true;
            }

            // Check for straight up element with ID
            else {
                if ( typeof hash == 'string' ) {
                    $target = $( hash );
                } else {
                    $target = hash;
                }
            }

            // Target check
            if ( $target.length ) {

                // LocalScroll vars
                var $lsSpeed  = self.config.localScrollSpeed ? parseInt( self.config.localScrollSpeed ) : 1000,
                    $lsOffset = self.config.localScrollOffset,
                    $lsEasing = self.config.localScrollEasing;

                // Sanitize offset
                offset = offset ? offset : $target.offset().top - $lsOffset;

                // Update hash
                if ( hash && $isLsDataLink && wpexLocalize.localScrollUpdateHash ) {
                    window.location.hash = hash;
                }

                /* Remove hash on site top click
                if ( '#site_top' == hash && wpexLocalize.localScrollUpdateHash && window.location.hash ) {
                    history.pushState( '', document.title, window.location.pathname);
                }*/

                // Mobile toggle Menu needs it's own code so it closes before the event fires
                // to make sure we end up in the right place
                var $mobileToggleNav = $( '.mobile-toggle-nav' );
                if ( $mobileToggleNav.hasClass( 'visible' ) ) {
                    $( 'a.mobile-menu-toggle, li.mobile-menu-toggle > a' ).removeClass( 'wpex-active' );
                    if ( wpexLocalize.animateMobileToggle ) {
                        $mobileToggleNav.slideUp( 'fast', function() {
                            $mobileToggleNav.removeClass( 'visible' );
                            $page.stop( true, true ).animate( {
                                scrollTop: $target.offset().top - $lsOffset
                            }, $lsSpeed );
                        } );
                    } else {
                        $mobileToggleNav.hide().removeClass( 'visible' );
                        $page.stop( true, true ).animate( {
                            scrollTop: $target.offset().top - $lsOffset
                        }, $lsSpeed );
                    }
                }

                // Scroll to target
                else {
                    $page.stop( true, true ).animate( {
                        scrollTop: offset
                    }, $lsSpeed, $lsEasing );
                }

            }

        },

        /**
         * Scroll to Hash.
         */
        scrollToHash: function( self ) {

            var hash    = location.hash;
            var $target = '';
            var $offset = '';

            // Hash needed
            if ( ! hash ) {
                return;
            }

            // Scroll to comments
            if ( '#view_comments' == hash || '#comments_reply' == hash ) {
                $target = $( '#comments' );
                $offset = $target.offset().top - self.config.localScrollOffset - 20;
                if ( $target.length ) {
                    self.scrollTo( $target, $offset );
                }
                return;
            }

            // Scroll to specific comment, fix for sticky header
            if ( self.config.hasStickyHeader && hash.indexOf( 'comment-' ) != -1 ) {
                $target = $( hash );
                $offset = $target.offset().top - self.config.localScrollOffset - 20;
                self.scrollTo( $target, $offset );
                return;
            }


            // Scroll to hash for localscroll links
            if ( hash.indexOf( 'localscroll-' ) != -1 ) {
                self.scrollTo( hash.replace( 'localscroll-', '' ) );
                return;
            }

            // Check elements with data attributes
            if ( $( '[data-ls_id="'+ hash +'"]' ).length ) {
                self.scrollTo( hash );
                return;
            }

        },

        /**
         * Local scroll links array.
         */
        localScrollSections: function() {
            var self = this;

            // Add local-scroll class to links in menu with localscroll- prefix (if on same page)
            // And add to $localScrollTargets
            // And add data-ls_linkto attr
            if ( self.config.$siteNav ) {

                var $navLinks    = $( 'a', this.config.$siteNav );
                var $location    = location;
                var $currentPage = $location.href;

                // Sanitize current page var
                $currentPage = $location.hash ? $currentPage.substr( 0, $currentPage.indexOf( '#' ) ) : $currentPage;

                // Loop through nav links
                $navLinks.each( function() {
                    var $this = $( this );
                    var $ref = $this.attr( 'href' );
                        if ( $ref && $ref.indexOf( 'localscroll-' ) != -1 ) {
                            $this.parent( 'li' ).addClass( 'local-scroll' );
                            var $withoutHash = $ref.substr( 0, $ref.indexOf( '#' ) );
                            if ( $withoutHash == $currentPage ) {
                                var $hash = $ref.substring( $ref.indexOf( '#' ) + 1 );
                                var $parseHash = $hash.replace( 'localscroll-', '' );
                                $this.attr( 'data-ls_linkto', '#' + $parseHash );
                            }
                        }
                } );

            }

            // Define main vars
            var $array = [];
            var $links = $( self.config.$localScrollTargets );

            // Loop through links
            for ( var i=0; i < $links.length; i++ ) {

                // Add to array and save hash
                var $link    = $links[i];
                var $linkDom = $( $link );
                var $href    = $( $link ).attr( 'href' );
                var $hash    = $href ? '#' + $href.replace( /^.*?(#|$)/, '' ) : null;

                // Hash required
                if ( $hash && '#' != $hash ) {

                    // Add custom data attribute to each
                    if ( ! $linkDom.attr( 'data-ls_linkto' ) ) {
                        $linkDom.attr( 'data-ls_linkto', $hash );
                    }

                    // Data attribute targets
                    if ( $( '[data-ls_id="'+ $hash +'"]' ).length ) {
                        if ( $.inArray( $hash, $array ) == -1 ) {
                            $array.push( $hash );
                        }
                    }

                    // Standard ID targets
                    else if ( $( $hash ).length ) {
                        if ( $.inArray( $hash, $array ) == -1 ) {
                            $array.push( $hash );
                        }
                    }

                }

            }

            // Return array of local scroll links
            return $array;

        },

        /**
         * Local Scroll link.
         */
        localScrollLinks: function() {
            var self = this;

            // Local Scroll - Menus
            $( self.config.$localScrollTargets ).on( 'click', function() {
                var $this = $( this );
                var $hash = $this.attr( 'data-ls_linkto' );
                $hash = $hash ? $hash : this.hash; // Fallback
                if ( $.inArray( $hash, self.config.localScrollSections ) > -1 ) {
                    $this.parent().removeClass( 'sfHover' );
                    self.scrollTo( $hash );
                    return false;
                }
            } );

            // Local Scroll - Logo
            $( 'a.wpex-scroll-top, .wpex-scroll-top a' ).on( 'click', function() {
                self.scrollTo( '#site_top' );
                return false;
            } );

            // Local Scroll - Woocommerce Reviews
            $( 'a.woocommerce-review-link', $( 'body.single div.entry-summary' ) ).click( function() {
                var $target = $( '.woocommerce-tabs' );
                if ( $target.length ) {
                    $( '.reviews_tab a' ).click();
                    var $offset = $target.offset().top - self.config.localScrollOffset;
                    self.scrollTo( $target, $offset );
                }
                return false;
            } );

        },

        /**
         * Local Scroll Highlight on scroll.
         */
        localScrollHighlight: function() {

            // Return if disabled
            if ( ! wpexLocalize.localScrollHighlight ) {
                return;
            }

            // Define main vars
            var self = this,
                localScrollSections = self.config.localScrollSections;

            // Return if there aren't any local scroll items
            if ( ! localScrollSections.length ) {
                return;
            }

            // Define vars
            var $windowPos = this.config.$window.scrollTop(),
                $divPos,
                $divHeight,
                $higlight_link,
                $targetDiv;

            // Highlight active items
            for ( var i=0; i < localScrollSections.length; i++ ) {

                // Get section
                var $section = localScrollSections[i];

                // Data attribute targets
                if ( $( '[data-ls_id="' + $section + '"]' ).length ) {
                    $targetDiv     = $( '[data-ls_id="'+ $section +'"]' );
                    $divPos        = $targetDiv.offset().top - self.config.localScrollOffset - 1;
                    $divHeight     = $targetDiv.outerHeight();
                    $higlight_link = $( '[data-ls_linkto="'+ $section +'"]' );
                }

                // Standard element targets
                else if ( $( $section ).length ) {
                    $targetDiv     = $( $section );
                    $divPos        = $targetDiv.offset().top - self.config.localScrollOffset - 1;
                    $divHeight     = $targetDiv.outerHeight();
                    $higlight_link = $( '[data-ls_linkto="' + $section + '"]' );
                }

                // Higlight items
                if ( $windowPos >= $divPos && $windowPos < ( $divPos + $divHeight ) ) {
                    $( '.local-scroll.menu-item' ).removeClass( 'current-menu-item' ); // prevent any sort of duplicate local scroll active links
                    $higlight_link.addClass( 'active' );
                    $targetDiv.addClass( 'wpex-ls-inview' );
                    $higlight_link.parent( 'li' ).addClass( 'current-menu-item' );
                } else {
                    $targetDiv.removeClass( 'wpex-ls-inview' );
                    $higlight_link.removeClass( 'active' );
                    $higlight_link.parent( 'li' ).removeClass( 'current-menu-item' );
                }

            }

            /* @todo: Highlight last item if at bottom of page or last item clicked - needs major testing now.
            var $docHeight    = this.config.$document.height();
            var windowHeight = this.config.windowHeight;
            var $lastLink = localScrollSections[localScrollSections.length-1];
            if ( $windowPos + windowHeight == $docHeight ) {
                $( '.local-scroll.current-menu-item' ).removeClass( 'current-menu-item' );
                $( "li.local-scroll a[href='" + $lastLink + "']" ).parent( 'li' ).addClass( 'current-menu-item' );
            }*/

        },

        /**
         * Equal heights function => Must run before isotope method.
         */
        equalHeights: function( $context ) {

            if ( 'undefined' === typeof $.fn.wpexEqualHeights ) {
                return;
            }

            // Add equal heights grid
            $( '.match-height-grid', $context ).wpexEqualHeights( {
                children: '.match-height-content'
            } );

            // Columns
            $( '.match-height-row', $context ).wpexEqualHeights( {
                children: '.match-height-content'
            } );

            // Feature Box
            $( '.vcex-feature-box-match-height', $context ).wpexEqualHeights( {
                children: '.vcex-match-height'
            } );

            // Blog entries
            $( '.blog-equal-heights', $context ).wpexEqualHeights( {
                children: '.blog-entry-inner'
            } );

            // Related entries
            $( '.related-posts', $context ).wpexEqualHeights( {
                children: '.related-post-content'
            } );

            // Row => @deprecated in v4.0
            $( '.wpex-vc-row-columns-match-height', $context ).wpexEqualHeights( {
                children: '.vc_column-inner'
            } );

            // Manual equal heights
            $( '.vc_row', $context ).wpexEqualHeights( {
                children: '.equal-height-column'
            } );
            $( '.vc_row', $context ).wpexEqualHeights( {
                children: '.equal-height-content'
            } );

        },

        /**
         * Footer Reveal Display on Load.
         */
        footerReveal: function() {
            var self = this;

            // Return if disabled
            if ( ! self.config.$hasFooterReveal ) {
                return;
            }

            // Footer reveal
            var $footerReveal = self.config.$footerReveal;

            function showHide() {

                // Disabled under 960
                if ( self.config.viewportWidth < 960 ) {
                    if ( $footerReveal.hasClass( 'footer-reveal' ) ) {
                        $footerReveal.toggleClass( 'footer-reveal footer-reveal-visible' );
                        self.config.$siteWrap.css( 'margin-bottom', '' );
                    }
                    return;
                }

                var $hideFooter         = false,
                    $footerRevealHeight = $footerReveal.outerHeight(),
                    windowHeight       = self.config.windowHeight,
                    $heightCheck        = 0;

                if ( $footerReveal.hasClass( 'footer-reveal' ) ) {
                    $heightCheck = self.config.$siteWrap.outerHeight() + self.config.localScrollOffset;
                } else {
                    $heightCheck = self.config.$siteWrap.outerHeight() + self.config.localScrollOffset - $footerRevealHeight;
                }

                // Check window height
                if ( ( windowHeight > $footerRevealHeight ) && ( $heightCheck  > windowHeight ) ) {
                    $hideFooter = true;
                }

                // Footer Reveal
                if ( $hideFooter && $footerReveal.hasClass( 'footer-reveal-visible' ) ) {
                    self.config.$siteWrap.css( {
                        'margin-bottom': $footerRevealHeight
                    } );
                    $footerReveal.removeClass( 'footer-reveal-visible' );
                    $footerReveal.addClass( 'footer-reveal' );
                }

                // Visible Footer
                if ( ! $hideFooter && $footerReveal.hasClass( 'footer-reveal' ) ) {
                    self.config.$siteWrap.css( 'margin-bottom', '' );
                    $footerReveal.removeClass( 'footer-reveal' );
                    $footerReveal.removeClass( 'wpex-visible' );
                    $footerReveal.addClass( 'footer-reveal-visible' );
                }

            }

            function reveal() {
                if ( $footerReveal.hasClass( 'footer-reveal' ) ) {
                    if ( self.scrolledToBottom( self.config.$siteMain ) ) {
                        $footerReveal.addClass( 'wpex-visible' );
                    } else {
                        $footerReveal.removeClass( 'wpex-visible' );
                    }
                }
            }

            // Fire on init
            showHide();

            // Fire onscroll event
            self.config.$window.scroll( function() {
                reveal();
            } );

            // Fire onResize
            self.config.$window.resize( function() {
                if ( self.config.widthChanged || self.config.heightChanged ) {
                    showHide();
                }
            } );

        },

        /**
         * Set min height on main container to prevent issue with extra space below footer.
         */
        fixedFooter: function() {
            var self = this;

            // Checks
            if ( ! self.config.$siteMain || ! self.config.hasFixedFooter ) {
                return;
            }

            function run() {

                // Set main vars
                var $mainHeight = self.config.$siteMain.outerHeight();
                var $htmlHeight = $( 'html' ).height();

                // Generate min Height
                var $minHeight = $mainHeight + ( self.config.$window.height() - $htmlHeight );

                // Add min height
                self.config.$siteMain.css( 'min-height', $minHeight );

            }

            // Run on doc ready
            run();

            // Run on resize
            self.config.$window.resize( function() {
                if ( self.config.widthChanged || self.config.heightChanged ) {
                    run();
                }
            } );

        },

        /**
         * If title and breadcrumbs don't both fit in the header switch breadcrumb style.
         */
        titleBreadcrumbsFix: function() {
            var self = this;

            // Return if disabled
            if ( ! self.config.$body.hasClass( 'has-breadcrumbs' ) ) {
                return;
            }

            var $pageHeader = $( '.page-header' );
            var $crumbs = $( '.site-breadcrumbs.position-absolute', $pageHeader );
            if ( ! $crumbs.length || ! $crumbs.hasClass( 'has-js-fix' ) ) {
                return;
            }

            var $crumbsTrail = $( '.breadcrumb-trail', $crumbs );
            if ( ! $crumbsTrail.length ) {
                return;
            }

            var $headerInner = $( '.page-header-inner', $pageHeader );
            if ( ! $headerInner.length ) {
                return;
            }

            var $title = $( '.page-header-title > span', $headerInner );
            if ( ! $title.length ) {
                return;
            }

            function tweak_classes() {
                if ( ( $title.width() + $crumbsTrail.width() + 20 ) >= $headerInner.width() ) {
                    if ( $crumbs.hasClass( 'position-absolute' ) ) {
                        $crumbs.removeClass( 'position-absolute' );
                        $crumbs.addClass( 'position-under-title' );
                    }
                } else {
                    $crumbs.removeClass( 'position-under-title' );
                    $crumbs.addClass( 'position-absolute' );
                }
            }

            // Run on init
            tweak_classes();

            // Run on resize
            self.config.$window.resize( function() {
                tweak_classes();
            } );

        },

        /**
         * Custom Selects.
         */
        customSelects: function( $context ) {

            $( wpexLocalize.customSelects, $context ).each( function() {
                var $this   = $( this );
                var elID    = $this.attr( 'id' );
                var elClass = elID ? ' wpex-' + elID : '';
                if ( $this.is( ':visible' ) ) {
                    if ( $this.attr( 'multiple' ) ) {
                        $this.wrap( '<div class="wpex-multiselect-wrap' + elClass + '"></div>' );
                    } else {
                        $this.wrap( '<div class="wpex-select-wrap' + elClass + '"></div>' );
                    }
                }
            } );

            $( '.wpex-select-wrap', $context ).append( '<span class="ticon ticon-angle-down" aria-hidden="true"></span>' );

            if ( 'undefined' !== typeof $.fn.select2 ) {
                $( '#calc_shipping_country' ).select2();
            }

        },

        /**
         * Archive Masonry Grids.
         */
        archiveMasonryGrids: function() {

            // Make sure scripts are loaded
            if ( 'undefined' === typeof $.fn.imagesLoaded || 'undefined' === typeof $.fn.isotope ) {
                return;
            }

            // Define main vars
            var self      = this;
            var $archives = $( '.wpex-masonry-grid,.blog-masonry-grid,div.wpex-row.portfolio-masonry,div.wpex-row.portfolio-no-margins,div.wpex-row.staff-masonry,div.wpex-row.staff-no-margins,div.wpex-row.testimonials-masonry' );

            // Loop through archives
            $archives.each( function() {

                var $container = $( this );
                var $data      = $container.data();

                // Load isotope after images loaded
                $container.imagesLoaded( function() {

                    var $grid = $container.isotope( {
                        itemSelector       : '.isotope-entry',
                        transformsEnabled  : true,
                        isOriginLeft       : wpexLocalize.isRTL ? false : true,
                        transitionDuration : self.pData( $data.transitionDuration, '0.4' ) + 's',
                        layoutMode         : self.pData( $data.layoutMode, 'masonry' )
                    } );

                } );

            } );

        },

        /**
         * Automatic Lightbox for images.
         */
        autoLightbox: function() {
            if ( ! wpexLocalize.iLightbox.auto ) {
                return;
            }
            var self     = this,
                imageExt = ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'jfif', 'jpe'];
            $( wpexLocalize.iLightbox.auto ).each( function() {
                var $this = $( this );
                var href  = $this.attr( 'href' );
                var ext   = self.getUrlExtension( href );
                if ( href && imageExt.indexOf( ext ) !== -1 ) {
                    if ( ! $this.parents( '.woocommerce-product-gallery' ).length ) {
                        $this.addClass( 'wpex-lightbox' );
                    }
                }
            } );
        },

        /**
         * iLightbox.
         */
        iLightbox: function( $context ) {
            var self = this;

            // Store lightbox settings in object
            self.iLightboxSettings = wpexLocalize.iLightbox;

            // Sanitize data
            self.iLightboxSettings.show.speed              = parseInt( self.iLightboxSettings.show.speed );
            self.iLightboxSettings.hide.speed              = parseInt( self.iLightboxSettings.hide.speed );
            self.iLightboxSettings.effects.repositionSpeed = parseInt( self.iLightboxSettings.effects.repositionSpeed );
            self.iLightboxSettings.effects.switchSpeed     = parseInt( self.iLightboxSettings.effects.switchSpeed  );
            self.iLightboxSettings.effects.loadedFadeSpeed = parseInt( self.iLightboxSettings.effects.loadedFadeSpeed );
            self.iLightboxSettings.effects.fadeSpeed       = parseInt( self.iLightboxSettings.effects.fadeSpeed );

            // Run lightbox functions
            self.iLightboxSingular();
            self.iLightboxGallery();
            self.iLightboxInlineGallery();
            self.iLightboxCarousel();

            // Lightbox Videos => OLD SCHOOL STUFF, keep for old customers
            $( '.wpex-lightbox-video, .wpb_single_image.video-lightbox a, .wpex-lightbox-autodetect, .wpex-lightbox-autodetect a', $context ).each( function() {

                var $this = $( this ),
                    $data = $this.data();

                $this.iLightBox( {
                    smartRecognition : true,
                    skin             : self.pData( $data.skin, wpexLocalize.iLightbox.skin ),
                    path             : 'horizontal',
                    controls         : {
                        fullscreen : wpexLocalize.iLightbox.controls.fullscreen,
                        slideshow  : false
                    },
                    show             : {
                        title : self.pData( $data.show_title, wpexLocalize.iLightbox.show.title ),
                        speed : parseInt( wpexLocalize.iLightbox.show.speed )
                    },
                    hide             : {
                        speed : parseInt( wpexLocalize.iLightbox.hide.speed )
                    },
                    effects          : {
                        reposition      : true,
                        repositionSpeed : 200,
                        switchSpeed     : 300,
                        loadedFadeSpeed : wpexLocalize.iLightbox.effects.loadedFadeSpeed,
                        fadeSpeed       : wpexLocalize.iLightbox.effects.fadeSpeed
                    },
                    overlay : wpexLocalize.iLightbox.overlay,
                    social  : wpexLocalize.iLightbox.social
                } );
            } );

        },

        /**
         * iLightbox | Singular.
         */
        iLightboxSingular: function( $context ) {
            var self = this;
            $( '.wpex-lightbox', $context ).each( function() {
                var $this = $( this );
                if ( ! $this.is( 'a' ) ) {
                    $this = $this.find( 'a' );
                }
                if ( ! $this.hasClass( 'wpex-lightbox-group-item' ) ) {
                    var $iLightbox = $this.iLightBox( $.extend( true, {}, self.iLightboxSettings, {
                        skin: self.pData( $this.data( 'skin' ), wpexLocalize.iLightbox.skin ),
                        show: {
                            title: self.pData( $this.data( 'show_title' ), wpexLocalize.iLightbox.show.title )
                        },
                        controls: {
                            arrows     : false,
                            thumbnail  : false,
                            mousewheel : false,
                            slideshow  : false
                        }
                    } ) );
                    $this.data( 'ilightbox', $iLightbox );
                }
            } );
        },

        /**
         * iLightbox | Gallery.
         */
        iLightboxGallery: function( $context ) {
            var self = this;
            $context = $context ? $context : $( 'body' );
            $context.on( 'click', 'a.wpex-lightbox-group-item', function() {

                // Remove all lb-indexes to prevent issues with filterable grids or hidden items
                $( '.wpex-lightbox-group-item' ).removeAttr( 'data-lb-index' );

                // Get lightbox data
                var $this         = $( this );
                var $group        = $this.closest( '.wpex-lightbox-group' );
                var $groupItems   = $group.find( 'a.wpex-lightbox-group-item:visible' );
                var iLightboxData = $group.data( 'iLightBox' );
                var items         = [];
                var activeIndex   = 0;

                // Destroy if lightbox has already been added and re-add
                // Prevents build-up in AJAX functions
                if ( iLightboxData ) {
                    iLightboxData.destroy();
                }

                // Prevent conflicts (can't be a group item and a lightbox item)
                $this.removeClass( 'wpex-lightbox' );

                // Loop through all group items
                $groupItems.each( function( index ) {
                    var $item = $( this );
                    var href  = $item.attr( 'href' );
                    var title = $item.data( 'title' ) ? $item.data( 'title' ) : $item.attr( 'title' );
                    if ( href ) {
                        $item.attr( 'data-lb-index', index );
                        if ( $this[0] == $item[0] ) {
                            activeIndex = index;
                        }
                        items.push( {
                            URL     : href,
                            title   : title,
                            caption : $item.data( 'caption' ),
                            type    : self.pData( $item.data( 'type' ), 'image' ),
                            options : $item.data( 'options' ) ? eval("({" + $item.data("options") + "})") : {}
                        } );
                    }
                } );

                // Start up lightbox
                var $iLightbox = $.iLightBox( items, $.extend( true, {}, self.iLightboxSettings, {
                    startFrom     : parseInt( activeIndex ),
                    skin          : self.pData( $group.data( 'skin' ), wpexLocalize.iLightbox.skin ),
                    path          : self.pData( $group.data( 'path' ), wpexLocalize.iLightbox.path ),
                    infinite      : self.pData( $group.data( 'infinite' ), wpexLocalize.iLightbox.infinite ),
                    show          : {
                        title     : self.pData( $group.data( 'show_title' ), wpexLocalize.iLightbox.show.title )
                    },
                    controls      : {
                        arrows    : self.pData( $group.data( 'arrows' ), wpexLocalize.iLightbox.controls.arrows ),
                        thumbnail : self.pData( $group.data( 'thumbnails' ), wpexLocalize.iLightbox.controls.thumbnail )
                    },
                } ) );

                // Save lightbox instance
                $group.data( 'iLightBox', $iLightbox );

                return false;

            } );
        },

        /**
         * iLightbox | Inline Gallery.
         */
        iLightboxInlineGallery: function( $context ) {
            var self = this;
            $( '.wpex-lightbox-gallery', $context ).on( 'click', function( event ) {

                var $this  = $( this ),
                    data   = $this.data( 'gallery' ),
                    images = '';

                if ( ! data ) {
                    return;
                }

                if ( typeof data == 'string' || data instanceof String ) {
                    images = data.split( ',' );
                } else {
                    images = data;
                }

                //console.log( $this.data( 'gallery' ) );

                $.iLightBox( images, $.extend( true, {}, self.iLightboxSettings, {
                    skin: self.pData( $this.data( 'skin' ), wpexLocalize.iLightbox.skin ),
                    path: self.pData( $this.data( 'path' ), wpexLocalize.iLightbox.path ),
                    infinite: self.pData( $this.data( 'skin' ), wpexLocalize.iLightbox.infinite ),
                    controls: {
                        arrows: self.pData( $this.data( 'arrows' ), wpexLocalize.iLightbox.controls.arrows ),
                        thumbnail: self.pData( $this.data( 'thumbnails' ), wpexLocalize.iLightbox.controls.thumbnail )
                    }
                } ) );

                return false;

            } );
        },

        /**
         * iLightbox | Carousel.
         */
        iLightboxCarousel: function( $context ) {
            var self = this;
            $( '.wpex-carousel', $context ).on( 'click', '.wpex-carousel-lightbox-item', function( e ) {
                e.preventDefault();

                var $this          = $( this ),
                    $parent        = $this.parents( '.wpex-carousel' ),
                    $parentOwl     = $this.parents( '.owl-item' ),
                    $owlItems      = $parent.find( '.owl-item' ),
                    $data          = $this.data(),
                    $imagesArray   = [];

                $owlItems.each( function() {
                    if ( ! $( this ).hasClass( 'cloned' ) ) {
                        var $image = $( this ).find( '.wpex-carousel-lightbox-item' );
                        if ( $image.length > 0 ) {
                            $imagesArray.push( {
                                URL     : $image.attr( 'href' ),
                                title   : $image.attr( 'data-title' ),
                                caption : $image.attr( 'data-caption' )
                            } );
                        }
                    }
                } );

                if ( $imagesArray.length > 0 ) {

                    // Define where to start lightbox from
                    var $startFrom = $this.data( 'count' ) - 1;
                    $startFrom = $startFrom ? $startFrom : 0;

                    $.iLightBox( $imagesArray, $.extend( true, {}, self.iLightboxSettings, {
                        startFrom: parseInt( $startFrom ),
                        skin: self.pData( $data.skin, wpexLocalize.iLightbox.skin ),
                        path: self.pData( $data.path, wpexLocalize.iLightbox.path ),
                        infinite: self.pData( $data.skin, wpexLocalize.iLightbox.infinite ),
                        show: {
                            title: self.pData( $data.show_title, wpexLocalize.iLightbox.show.title )
                        },
                        controls: {
                            arrows: self.pData( $data.arrows, wpexLocalize.iLightbox.controls.arrows ),
                            thumbnail: self.pData( $data.thumbnails, wpexLocalize.iLightbox.controls.thumbnail )
                        }
                    } ) );

                }
            } );
        },

        /**
         * Overlay Mobile Support.
         */
        overlaysMobileSupport: function() {

            if ( ! this.config.isMobile ) {
                return;
            }

            // Remove overlays completely if mobile support is disabled
            $( '.overlay-parent.overlay-hh' ).each( function() {
                if ( ! $( this ).hasClass( 'overlay-ms' ) ) {
                    $( this ).find( '.theme-overlay' ).remove();
                }
            } );

            // Prevent click on touchstart
            $( 'a.overlay-parent.overlay-ms.overlay-h, .overlay-parent.overlay-ms.overlay-h > a' ).on( 'touchstart', function( e ) {

                var $this = $( this );
                var $overlayParent = $this.hasClass( 'overlay-parent' ) ? $this : $this.parent( '.overlay-parent' );

                if ( $overlayParent.hasClass( 'wpex-touched' ) ) {
                    return true;
                } else {
                    $overlayParent.addClass( 'wpex-touched' );
                    $( '.overlay-parent' ).not($overlayParent).removeClass( 'wpex-touched' );
                    e.preventDefault();
                    return false;
                }

            } );

            // Hide overlay when clicking outside
            this.config.$document.on( 'touchstart', function( e ) {
                if ( ! $( e.target ).closest( '.wpex-touched' ).length ) {
                    $( '.wpex-touched' ).removeClass( 'wpex-touched' );
                }
            } );

        },

        /**
         * Overlay Hovers.
         */
        overlayHovers: function() {

            // Overlay title push up.
            $( '.overlay-parent-title-push-up' ).each( function() {

                // Define vars
                var $this        = $( this ),
                    $title       = $this.find( '.overlay-title-push-up' ),
                    $child       = $this.find( 'a' ),
                    $img         = $child.find( 'img' ),
                    $titleHeight = $title.outerHeight();

                // Position title
                $title.css( {
                    'bottom' : - $titleHeight
                } );

                // Add height to child
                $child.css( {
                    'height' : $img.outerHeight()
                } );

                // Position image
                $img.css( {
                    'position' : 'absolute',
                    'top'      : '0',
                    'left'     : '0',
                    'width'    : 'auto',
                    'height'   : 'auto'
                } );

                // Animate image on hover
                $this.hover( function() {
                    $img.css( {
                        'top' : -20
                    } );
                    $title.css( {
                        'bottom' : 0
                    } );
                }, function() {
                    $img.css( {
                        'top' : '0'
                    } );
                    $title.css( {
                        'bottom' : - $titleHeight
                    } );
                } );

            } );

        },

        /**
         * Sticky Topbar.
         */
        stickyTopBar: function() {
            var self = this;

            // Return if disabled or not found
            if ( ! self.config.hasStickyTopBar || ! self.config.$stickyTopBar ) {
                return;
            }

            // Define vars
            var $isSticky      = false,
                $offset        = 0,
                $window        = self.config.$window,
                $stickyTopbar  = self.config.$stickyTopBar,
                $mobileSupport = self.config.hasStickyTopBarMobile,
                $brkPoint      = wpexLocalize.stickyTopBarBreakPoint,
                $mobileMenu    = $( '#wpex-mobile-menu-fixed-top' ),
                $stickyWrap    = $( '<div id="top-bar-wrap-sticky-wrapper" class="wpex-sticky-top-bar-holder not-sticky"></div>' );

            // Set sticky wrap to new wrapper
            $stickyTopbar.wrapAll( $stickyWrap );
            $stickyWrap = $( '#top-bar-wrap-sticky-wrapper' );

            // Get offset
            function getOffset() {
                $offset = 0; // Reset offset for resize
                if ( self.config.$wpAdminBar.is( ':visible' ) ) {
                    $offset = $offset + self.config.$wpAdminBar.outerHeight();
                }
                if ( $mobileMenu.is( ':visible' ) ) {
                    $offset = $offset + $mobileMenu.outerHeight();
                }
                return $offset;
            }

            // Stick the TopBar
            function setSticky() {

                // Already stuck
                if ( $isSticky ) {
                    return;
                }

                // Add wrap class and toggle sticky class
                $stickyWrap
                    .css( 'height', $stickyTopbar.outerHeight() )
                    .removeClass( 'not-sticky' )
                    .addClass( 'is-sticky' );

                // Add CSS to topbar
                $stickyTopbar.css( {
                    'top'   : getOffset(),
                    'width' : $stickyWrap.width()
                } );

                // Set sticky to true
                $isSticky = true;

            }

            // Unstick the TopBar
            function destroySticky() {

                if ( ! $isSticky ) {
                    return;
                }

                // Remove sticky wrap height and toggle sticky class
                $stickyWrap
                    .css( 'height', '' )
                    .removeClass( 'is-sticky' )
                    .addClass( 'not-sticky' );

                // Remove topbar css
                $stickyTopbar.css( {
                    'width' : '',
                    'top'   : '',
                } );

                // Set sticky to false
                $isSticky = false;

            }

            // Runs on load and resize
            function initSticky() {

                if ( ! $mobileSupport && ( self.config.viewportWidth < $brkPoint ) ) {
                    $stickyWrap.removeClass( 'wpex-can-sticky' );
                    destroySticky();
                    return;
                }

                $stickyWrap.addClass( 'wpex-can-sticky' );

                if ( $isSticky ) {

                    $stickyWrap.css( 'height', $stickyTopbar.outerHeight() );

                    $stickyTopbar.css( {
                        'top'   : getOffset(),
                        'width' : $stickyWrap.width()
                    } );

                } else {

                    // Set sticky based on original offset
                    $offset = $stickyWrap.offset().top - getOffset();

                    // Set or destroy sticky
                    if ( self.config.windowTop > $offset ) {
                        setSticky();
                    } else {
                        destroySticky();
                    }

                }

            }

            // On scroll actions for sticky topbar
            function onScroll() {

                // Not allowed to sticky at this window size
                if ( ! $stickyWrap.hasClass( 'wpex-can-sticky' ) ) {
                    return;
                }

                // Destroy sticky at top and prevent sticky at top (since its already at top)
                if ( 0 === self.config.windowTop ) {
                    if ( $isSticky ) {
                        destroySticky();
                    }
                    return;
                }

                // Get correct start position for sticky to start
                var $stickyWrapTop = $stickyWrap.offset().top;
                var $setStickyPos  = $stickyWrapTop - getOffset();

                // Set or destroy sticky based on offset
                if ( self.config.windowTop >= $setStickyPos ) {
                    setSticky();
                } else {
                    destroySticky();
                }

            }

            // Fire on init
            initSticky();

            // Fire onscroll event
            $window.scroll( function() {
                onScroll();
            } );

            // Fire onResize
            $window.resize( function() {
                initSticky();
            } );

            // Fire resize on flip
            // Destroy and re-calculate
            $window.on( 'orientationchange' , function( e ) {
                destroySticky();
                initSticky();
            } );

        },

        /**
         * Get correct offSet for the sticky header and sticky header menu.
         */
        stickyOffset: function() {
            var self          = this;
            var $offset       = 0;
            var $mobileMenu   = $( '#wpex-mobile-menu-fixed-top' );
            var $stickyTopbar = $( '#top-bar-wrap-sticky-wrapper.wpex-can-sticky' );

            // Offset sticky topbar
            if ( $stickyTopbar.is( ':visible' ) ) {
                $offset = $offset + $stickyTopbar.outerHeight();
            }

            // Offset mobile menu
            if ( $mobileMenu.is( ':visible' ) ) {
                $offset = $offset + $mobileMenu.outerHeight();
            }

            // Offset adminbar
            if ( this.config.$wpAdminBar.is( ':visible' ) ) {
                $offset = $offset + this.config.$wpAdminBar.outerHeight();
            }

            // Added offset via child theme
            if ( wpexLocalize.addStickyHeaderOffset ) {
                $offset = $offset + wpexLocalize.addStickyHeaderOffset;
            }

            // Return correct offset
            return $offset;

        },

        /**
         * Sticky header custom start point.
         */
        stickyHeaderCustomStartPoint: function() {
            var $startPosition = wpexLocalize.stickyHeaderStartPosition;
            if ( $.isNumeric( $startPosition ) ) {
                $startPosition = $startPosition;
            } else if ( $( $startPosition ).length ) {
                $startPosition = $( $startPosition ).offset().top;
            } else {
                $startPosition = 0;
            }
            return $startPosition;
        },

        /**
         * New Sticky Header.
         */
        stickyHeader: function() {
            var self           = this,
                $isSticky      = false,
                $isShrunk      = false,
                $isLogoSwapped = false;

            // Return if sticky is disabled
            if ( ! self.config.hasStickyHeader ) {
                return;
            }

            // Define header
            var $header        = self.config.$siteHeader;
            var $headerHeight  = self.config.siteHeaderHeight;
            var $headerBottom  = $header.offset().top + $header.outerHeight();

            // Add sticky wrap
            var $stickyWrap = $( '<div id="site-header-sticky-wrapper" class="wpex-sticky-header-holder not-sticky"></div>' );
            $header.wrapAll( $stickyWrap );
            $stickyWrap     = $( '#site-header-sticky-wrapper' ); // Cache newly added element as dom object

            // Define main vars for sticky function
            var $window        = self.config.$window;
            var $brkPoint      = wpexLocalize.stickyHeaderBreakPoint;
            var $mobileSupport = self.config.hasStickyMobileHeader;
            var $customStart   = self.stickyHeaderCustomStartPoint();

            // Custom sticky logo
            var $headerLogo    = self.config.$siteLogo;
            var $headerLogoSrc = self.config.siteLogoSrc;

            // Shrink support
            var maybeShrink = ( 'shrink' == self.stickyHeaderStyle || 'shrink_animated' == self.stickyHeaderStyle ) ? true : false;

            // Custom shrink logo
            var $stickyLogo = wpexLocalize.stickyheaderCustomLogo;
            if ( $stickyLogo
                && wpexLocalize.stickyheaderCustomLogoRetina
                && self.config.isRetina
            ) {
                $stickyLogo = wpexLocalize.stickyheaderCustomLogoRetina;
            }

            // Load images to be used for the custom sticky logo
            if ( $stickyLogo ) {
                $( '<img src="' + $stickyLogo + '">' ).appendTo( 'body' ).css( 'display', 'none' );
            }

            // Check if we are on mobile size
            function pastBreakPoint() {
                return ( self.config.viewportWidth < $brkPoint ) ? true : false;
            }

            // Check if we are past the header
            function pastheader() {
                var bottomCheck = 0;
                if ( self.config.hasHeaderOverlay ) {
                    bottomCheck = $headerBottom;
                } else {
                    bottomCheck = $stickyWrap.offset().top + $stickyWrap.outerHeight();
                }
                if ( self.config.windowTop > $headerBottom ) {
                    return true;
                }
                return false;
            }

            // Check start position
            function start_position() {
                var $startPosition = $customStart;
                $startPosition = $startPosition ? $startPosition : $stickyWrap.offset().top;
                return $startPosition - self.stickyOffset();
            }

            // Transform
            function transformPrepare() {
                if ( $isSticky ) {
                    $header.addClass( 'transform-go' ); // prevent issues when scrolling
                }
                if ( 0 === self.config.windowTop ) {
                    $header.removeClass( 'transform-prepare' );
                } else if ( pastheader() ) {
                    $header.addClass( 'transform-prepare' );
                } else {
                    $header.removeClass( 'transform-prepare' );
                }
            }

            // Swap logo
            function swapLogo() {

                if ( ! $stickyLogo || ! $headerLogo ) {
                    return;
                }

                if ( $isLogoSwapped ) {

                    $headerLogo.attr( 'src', $headerLogoSrc );
                    self.config.siteLogoHeight = self.config.$siteLogo.height();

                    $isLogoSwapped = false;

                } else {

                    $headerLogo.attr( 'src', $stickyLogo );
                    self.config.siteLogoHeight = self.config.$siteLogo.height();

                    $isLogoSwapped = true;

                }

            }

            // Shrink/unshrink header
            function shrink() {

                var checks = maybeShrink;

                if ( pastBreakPoint() ) {
                    if ( $mobileSupport && ( 'icon_buttons' == self.config.mobileMenuToggleStyle || 'fixed_top' == self.config.mobileMenuToggleStyle ) ) {
                        checks = true;
                    } else {
                        checks = false;
                    }
                }

                if ( checks && pastheader() ) {

                    if ( ! $isShrunk && $isSticky ) {
                        $header.addClass( 'sticky-header-shrunk' );
                        $isShrunk = true;
                    }

                } else {

                    $header.removeClass( 'sticky-header-shrunk' );
                    $isShrunk = false;

                }

            }

            // Set sticky
            function setSticky() {

                // Already stuck
                if ( $isSticky ) {
                    return;
                }

                // Custom Sticky logo
                swapLogo();

                // Add wrap class and toggle sticky class
                $stickyWrap
                    .css( 'height', $headerHeight )
                    .removeClass( 'not-sticky' )
                    .addClass( 'is-sticky' );

                // Tweak header
                $header.removeClass( 'dyn-styles' ).css( {
                    'top'       : self.stickyOffset(),
                    'width'     : $stickyWrap.width()
                } );

                // Add transform go class
                if ( $header.hasClass( 'transform-prepare' ) ) {
                    $header.addClass( 'transform-go' );
                }

                // Set sticky to true
                $isSticky = true;

            }

            // Destroy actions
            function destroyActions() {

                // Reset logo
                swapLogo();

                // Remove sticky wrap height and toggle sticky class
                $stickyWrap.removeClass( 'is-sticky' ).addClass( 'not-sticky' );

                // Do not remove height on sticky header for shrink header incase animation isn't done yet
                if ( ! $header.hasClass( 'shrink-sticky-header' ) ) {
                    $stickyWrap.css( 'height', '' );
                }

                // Reset header
                $header.addClass( 'dyn-styles' ).css( {
                    'width' : '',
                    'top'   : ''
                } ).removeClass( 'transform-go' );

                // Set sticky to false
                $isSticky = false;

                // Make sure shrink header is removed
                $header.removeClass( 'sticky-header-shrunk' ); // Fixes some bugs with really fast scrolling
                $isShrunk = false;

            }

            // Destroy sticky
            function destroySticky() {

                // Already unstuck
                if ( ! $isSticky ) {
                    return;
                }

                if ( $customStart ) {
                    $header.removeClass( 'transform-go' );
                    if ( $isShrunk ) {
                        $header.removeClass( 'sticky-header-shrunk' );
                        $isShrunk = false;
                    }
                } else {
                    $header.removeClass( 'transform-prepare' );
                }

                destroyActions();

            }

            // On load check
            function initResizeSetSticky() {

                if ( ! $mobileSupport && pastBreakPoint() ) {
                    destroySticky();
                    $stickyWrap.removeClass( 'wpex-can-sticky' );
                    $header.removeClass( 'transform-prepare' );
                    return;
                }

                //$header.addClass( 'transform-go' );
                $stickyWrap.addClass( 'wpex-can-sticky' );

                if ( $isSticky ) {

                    if ( ! $header.hasClass( 'shrink-sticky-header' ) ) {
                        $stickyWrap.css( 'height', self.config.siteHeaderHeight );
                    }

                    $header.css( {
                        'top'   : self.stickyOffset(),
                        'width' : $stickyWrap.width()
                    } );

                } else {

                    if ( self.config.windowTop > start_position() && 0 !== self.config.windowTop ) {
                        setSticky();
                    } else {
                        destroySticky();
                    }

                }

                if ( maybeShrink ) {
                    shrink();
                }

            }

            // On scroll function
            function onScroll() {

                // Disable on mobile devices
                if ( ! $stickyWrap.hasClass( 'wpex-can-sticky' ) ) {
                    return;
                }

                // Animate scroll with custom start
                if ( $customStart ) {
                    transformPrepare();
                }

                // Destroy sticky at top
                if ( 0 === self.config.windowTop ) {
                    destroySticky();
                    return;
                }

                // Set or destroy sticky
                if ( self.config.windowTop >= start_position() ) {
                    setSticky();
                } else {
                    destroySticky();
                }

                // Shrink
                if ( maybeShrink ) {
                    shrink();
                }

            }

            // Fire on init
            initResizeSetSticky();

            // Fire onscroll event
            $window.scroll( function() {
                if ( self.config.$hasScrolled ) {
                    onScroll();
                }
            } );

            // Fire onResize
            $window.resize( function() {
                if ( self.config.widthChanged || self.config.heightChanged ) {
                    initResizeSetSticky();
                }
            } );

            // Destroy and run onResize function on orientation change
            $window.on( 'orientationchange' , function() {
                destroySticky();
                initResizeSetSticky();
            } );

        },

        /**
         * Sticky Header Menu.
         */
        stickyHeaderMenu: function() {
            var self = this;

            // Return if disabled
            if ( ! self.config.hasStickyNavbar ) {
                return;
            }

            // Main vars
            var $navWrap       = self.config.$siteNavWrap,
                $isSticky      = false,
                $window        = self.config.$window,
                elIndex        = $( $navWrap ).index(),
                $stickyWrap    = $( '<div id="site-navigation-sticky-wrapper" class="wpex-sticky-navigation-holder not-sticky"></div>' );

            // Define sticky wrap
            $navWrap.wrapAll( $stickyWrap );
            $stickyWrap = $( '#site-navigation-sticky-wrapper' );

            // Add offsets
            var $stickyWrapTop = $stickyWrap.offset().top,
                $stickyOffset  = self.stickyOffset(),
                $setStickyPos  = $stickyWrapTop - $stickyOffset;

            // Shrink header function
            function setSticky() {

                // Already sticky
                if ( $isSticky ) {
                    return;
                }

                // Add wrap class and toggle sticky class
                $stickyWrap
                    .css( 'height', self.config.$siteNavWrap.outerHeight() )
                    .removeClass( 'not-sticky' )
                    .addClass( 'is-sticky' );

                // Add CSS to topbar
                $navWrap.css( {
                    'top'   : self.stickyOffset(),
                    'width' : $stickyWrap.width()
                } );

                // Remove header dynamic styles
                self.config.$siteHeader.removeClass( 'dyn-styles' );

                // Update shrunk var
                $isSticky = true;

            }

            // Un-Shrink header function
            function destroySticky() {

                // Not shrunk
                if ( ! $isSticky ) {
                    return;
                }

                // Remove sticky wrap height and toggle sticky class
                $stickyWrap
                    .css( 'height', '' )
                    .removeClass( 'is-sticky' )
                    .addClass( 'not-sticky' );

                // Remove navbar width
                $navWrap.css( {
                    'width' : '',
                    'top'   : ''
                } );

                // Re-add dynamic header styles
                self.config.$siteHeader.addClass( 'dyn-styles' );

                // Update shrunk var
                $isSticky = false;

            }

            // On load check
            function initResizeSetSticky() {

                if ( self.config.viewportWidth <= wpexLocalize.stickyNavbarBreakPoint ) {
                    destroySticky();
                    $stickyWrap.removeClass( 'wpex-can-sticky' );
                    return;
                }

                $stickyWrap.addClass( 'wpex-can-sticky' );

                if ( $isSticky ) {
                    $navWrap.css( 'width', $stickyWrap.width() );
                } else {
                    if ( self.config.windowTop >= $setStickyPos && 0 !== self.config.windowTop ) {
                        setSticky();
                    } else {
                        destroySticky();
                    }

                }

            }

            // Sticky check / enable-disable
            function onScroll() {

                if ( ! $stickyWrap.hasClass( 'wpex-can-sticky' ) ) {
                    return;
                }

                // Destroy sticky at top and prevent sticky at top (since its already at top)
                if ( 0 === self.config.windowTop ) {
                    if ( $isSticky ) {
                        destroySticky();
                    }
                    return;
                }

                // Sticky menu
                if ( self.config.windowTop >= $setStickyPos ) {
                    setSticky();
                } else {
                    destroySticky();
                }

            }

            // Fire on init
            initResizeSetSticky();

            // Fire onscroll event
            $window.scroll( function() {
                if ( self.config.$hasScrolled ) {
                    onScroll();
                }
            } );

            // Fire onResize
            $window.resize( function() {
                initResizeSetSticky();
            } );

            // Fire resize on flip
            $window.on( 'orientationchange' , function() {
                destroySticky();
                initResizeSetSticky();
            } );

        },

        /**
         * Contact form 7 switch preloader for txt.
         */
        ctf7Preloader: function() {

            // Return if disabled
            if ( ! wpexLocalize.altercf7Prealoader ) {
                return;
            }

            // Forms
            var $forms = $( 'form.wpcf7-form' );

            // Loop through forms
            $forms.each( function() {

                var $this = $( this );

                // Find button
                var $button = $this.find( '.wpcf7-submit' );

                // Hide loader if button found
                if ( $button.length ) {

                    // Hide preLoader
                    $this.find( '.ajax-loader' ).remove();

                    // Add font awesome spinner
                    var $customLoader = $( '<span class="ticon ticon-refresh ticon-spin wpex-wpcf7-loader"></span>' );
                    $button.after( $customLoader );

                    // Show new spinner on Send button click
                    $button.on( 'click', function() {
                        $customLoader.addClass( 'visible' );
                    } );

                    // Hide new spinner on result
                    $( 'div.wpcf7' ).on( 'wpcf7:invalid wpcf7:spam wpcf7:mailsent wpcf7:mailfailed', function() {
                        $customLoader.removeClass( 'visible' );
                    } );

                }

            } );

        },

        /**
         * Visual Composer Slider & Accordions.
         */
        vcTabsTogglesJS: function() {
            var self = this;

            // Only needed when VC is enabled
            if ( ! this.config.$body.hasClass( 'wpb-js-composer' ) ) {
                return;
            }

            function onShow( event ) {

                var tabID   = '';
                var $target = $( event.target );
                var $tab    = '';

                if ( undefined !== $target.data( 'vc-target' ) ) {
                    $tab = $( $target.data( 'vc-target' ) );
                } else {
                    $tab = $( $target.attr( 'href' ) );
                }

                if ( $tab.length ) {

                    // Sliders
                    $tab.find( '.wpex-slider' ).each( function() {
                        $( this ).sliderPro( 'update' );
                    } );

                    // Grids
                    $tab.find( '.vcex-isotope-grid' ).each( function() {
                        $( this ).isotope( 'layout' );
                    } );

                    // Filter links
                    if ( typeof( window[ 'vcexNavbarFilterLinks' ] ) !== 'undefined' ) {
                        window.vcexNavbarFilterLinks( $tab );
                    }

                }

            }

            // Re-trigger/update things when opening VC tabs
            $( '.vc_tta-tabs' ).on( 'show.vc.tab', onShow );

            // Re-trigger slider on tabs change
            $( '.vc_tta-accordion' ).on( 'show.vc.accordion', onShow );

            // Tab clicks custom checks - due to issues with show.vc.tab not triggering on click in v5.4.3
            // Front-end only (breaks back-end tabs and not needed there apparently)
            self.config.$document.on( 'click.vc.tabs.data-api', '[data-vc-tabs]', function( e ) {

                if ( self.config.$body.hasClass( 'vc_editor' ) ) {
                    return;
                }

                var $tab = $( $( this ).attr( 'href' ) );

                if ( $tab.length ) {

                    // Sliders
                    $tab.find( '.wpex-slider' ).each( function() {
                        $( this ).sliderPro( 'update' );
                    } );

                    // Grids
                    $tab.find( '.vcex-isotope-grid' ).each( function() {
                        $( this ).isotope( 'layout' );
                    } );

                }

            } );

        },

        /**
         * Visual Composer Accessability fixes.
         */
        vcAccessability: function() {

            if ( ! this.config.vcActive ) {
                return;
            }

            // Add tab index to toggles and toggle on enter
            var $toggles = $( '.vc_toggle .vc_toggle_title' );
            $toggles.each( function( index ) {
                var $this = $( this );
                $this.attr( 'tabindex', 0 );
                $this.on( 'keydown', function( e ) {
                    if ( 13 == e.which ) {
                        $this.trigger( 'click' );
                    }
                } );
            } );

            // Tabs
            var $tabContainers = $( '.vc_tta-container' );

            var tabClick = function( $thisTab, $allTabs, $tabPanels, i ) {
                $allTabs.attr( 'tabindex', -1 );
                $thisTab.attr( 'tabindex', 0 ).focus().click();
            };

            $tabContainers.each( function() {

                var $tabContainer = $( this ),
                    $tabs         = $tabContainer.find( '.vc_tta-tab > a' ),
                    $panels       = $tabContainer.find( '.vc_tta-panels' );

                $tabs.each( function( index ) {

                    var $tab = $( this );

                    if ( 0 == index ) {
                        $tab.attr( 'tabindex', 0 );
                    } else {
                        $tab.attr( 'tabindex', -1 );
                    }

                    $tab.on( 'keydown', function( e ) {

                        var $this        = $( this ),
                            keyCode      = e.which,
                            $nextTab     = $this.parent().next().is( 'li.vc_tta-tab' ) ? $this.parent().next().find( 'a' ) : false,
                            $previousTab = $this.parent().prev().is( 'li.vc_tta-tab' ) ? $this.parent().prev().find( 'a' ) : false,
                            $firstTab    = $this.parent().parent().find( 'li.vc_tta-tab:first' ).find( 'a' ),
                            $lastTab     = $this.parent().parent().find( 'li.vc_tta-tab:last' ).find( 'a' );

                        switch( keyCode ) {

                        // Left/Up
                        case 37 :
                        case 38 :
                            e.preventDefault();
                            e.stopPropagation();
                            if ( ! $previousTab) {
                                tabClick( $lastTab, $tabs, $panels );
                            } else {
                                tabClick( $previousTab, $tabs, $panels );
                            }
                        break;

                        // Right/Down
                        case 39 :
                        case 40 :
                            e.preventDefault();
                            e.stopPropagation();
                            if ( ! $nextTab ) {
                                tabClick( $firstTab, $tabs, $panels );
                            } else {
                                tabClick( $nextTab, $tabs, $panels );
                            }
                        break;

                        // Home
                        case 36 :
                            e.preventDefault();
                            e.stopPropagation();
                            tabClick( $firstTab, $tabs, $panels );
                            break;
                        // End
                        case 35 :
                            e.preventDefault();
                            e.stopPropagation();
                            tabClick( $lastTab, $tabs, $panels );
                        break;

                        // Enter/Space
                        case 13 :
                        case 32 :
                            e.preventDefault();
                            e.stopPropagation();
                        break;

                        } // end switch

                    } );

                } );

            } );

        },

        /**
         * Parses data to check if a value is defined in the data attribute and if not returns the fallback..
         */
        pData: function( val, fallback ) {
            return ( typeof val !== 'undefined' ) ? val : fallback;
        },

        /**
         * Returns extension from URL
         */
        getUrlExtension: function( url ) {
            var ext = url.split( '.' ).pop().toLowerCase();
            var extra = ext.indexOf( '?' ) !== -1 ? ext.split( '?' ).pop() : '';
            ext = ext.replace( extra, '' );
            return ext.replace( '?', '' );
        },

        /**
         * Check if window has scrolled to bottom of element
         */
        scrolledToBottom: function( elem ) {
            return this.config.windowTop >= elem.offset().top + elem.outerHeight() - window.innerHeight;
        }

    };

    // Start things up
    wpex.init();

} ) ( jQuery );