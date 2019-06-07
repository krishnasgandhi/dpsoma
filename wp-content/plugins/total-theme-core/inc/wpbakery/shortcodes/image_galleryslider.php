<?php
/**
 * Visual Composer Image Gallery
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'VCEX_Image_Gallery_Slider' ) ) {

	class VCEX_Image_Gallery_Slider {

		/**
		 * Define shortcode name.
		 */
		public $shortcode = 'vcex_image_galleryslider';

		/**
		 * Main constructor.
		 */
		public function __construct() {
			add_shortcode( $this->shortcode, array( $this, 'output' ) );
			add_action( 'vc_after_mapping', array( $this, 'vc_after_mapping' ) );
		}

		/**
		 * Shortcode output => Get template file and display shortcode.
		 */
		public function output( $atts, $content = null ) {
			ob_start();
			include( vcex_get_shortcode_template( $this->shortcode ) );
			return ob_get_clean();
		}

		/**
		 * VC functions.
		 */
		public function vc_after_mapping() {
			vc_lean_map( $this->shortcode, array( $this, 'map' ) );
		}

		/**
		 * Map shortcode to VC.
		 */
		public function map() {
			return array(
				'name' => esc_html__( 'Gallery Slider', 'total-theme-core' ),
				'description' => esc_html__( 'Image slider with thumbnail navigation', 'total-theme-core' ),
				'base' => $this->shortcode,
				'category' => vcex_shortcodes_branding(),
				'icon' => 'vcex-image-gallery-slider vcex-icon ticon ticon-picture-o',
				'params' => array(
					// Gallery
					array(
						'type' => 'vcex_attach_images',
						'heading' => esc_html__( 'Images', 'total-theme-core' ),
						'param_name' => 'image_ids',
						'description' => esc_html__( 'You can display captions by giving your images a caption and you can also display videos by adding an image that has a Video URL defined for it.', 'total-theme-core' ),
						'group' => esc_html__( 'Gallery', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'admin_label' => true,
						'heading' => esc_html__( 'Post Gallery', 'total-theme-core' ),
						'param_name' => 'post_gallery',
						'group' => esc_html__( 'Gallery', 'total-theme-core' ),
						'description' => esc_html__( 'Enable to display images from the current post "Image Gallery".', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Custom Field Name', 'total-theme-core' ),
						'param_name' => 'custom_field_gallery',
						'group' => esc_html__( 'Gallery', 'total-theme-core' ),
						'description' => esc_html__( 'Enter the name of an Advanced Custom Field gallery or other meta field that returns an array of attachment ID\'s or a comma separated string to pull images from.', 'total-theme-core' ),
					),
					// General
					array(
						'type' => 'vcex_visibility',
						'heading' => esc_html__( 'Visibility', 'total-theme-core' ),
						'param_name' => 'visibility',
					),
					vcex_vc_map_add_css_animation(),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Lazy Load', 'total-theme-core' ),
						'param_name' => 'lazy_load',
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Randomize', 'total-theme-core' ),
						'param_name' => 'randomize',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Unique Id', 'total-theme-core' ),
						'param_name' => 'unique_id',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Extra class name', 'total-theme-core' ),
						'param_name' => 'classes',
						'description' => esc_html__( 'Style particular content element differently - add a class name and refer to it in custom CSS.', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Animation', 'total-theme-core' ),
						'param_name' => 'animation',
						'std' => 'slide',
						'choices' => array(
							'slide' => esc_html__( 'Slide', 'total-theme-core' ),
							'fade_slides' => esc_html__( 'Fade', 'total-theme-core' ),
						),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Loop', 'total-theme-core' ),
						'param_name' => 'loop',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Auto Height Animation', 'total-theme-core' ),
						'std' => '500',
						'param_name' => 'height_animation',
						'description' => esc_html__( 'You can enter "0.0" to disable the animation completely.', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Animation Speed', 'total-theme-core' ),
						'param_name' => 'animation_speed',
						'std' => '600',
						'description' => esc_html__( 'Enter a value in milliseconds.', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Auto Play', 'total-theme-core' ),
						'param_name' => 'slideshow',
						'description' => esc_html__( 'Enable automatic slideshow? Disabled in front-end composer to prevent page "jumping".', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Auto Play Delay', 'total-theme-core' ),
						'param_name' => 'slideshow_speed',
						'std' => '5000',
						'description' => esc_html__( 'Enter a value in milliseconds.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'slideshow', 'value' => 'true' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Arrows', 'total-theme-core' ),
						'param_name' => 'direction_nav',
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Arrows on Hover', 'total-theme-core' ),
						'param_name' => 'direction_nav_hover',
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Dot Navigation', 'total-theme-core' ),
						'param_name' => 'control_nav',
					),
					// Image
					array(
						'type' => 'vcex_image_sizes',
						'heading' => esc_html__( 'Image Size', 'total-theme-core' ),
						'param_name' => 'img_size',
						'std' => 'wpex_custom',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_image_crop_locations',
						'heading' => esc_html__( 'Image Crop Location', 'total-theme-core' ),
						'param_name' => 'img_crop',
						'std' => 'center-center',
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Width', 'total-theme-core' ),
						'param_name' => 'img_width',
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Height', 'total-theme-core' ),
						'param_name' => 'img_height',
						'description' => esc_html__( 'Enter a height in pixels. Leave empty to disable vertical cropping and keep image proportions.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
						'group' => esc_html__( 'Image', 'total-theme-core' )
					),
					// Thumbnails
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Columns', 'total-theme-core' ),
						'param_name' => 'thumbnails_columns',
						'std' => '5',
						'description' => esc_html__( 'This specific slider displays the thumbnails in "rows" if you want your thumbnails displayed under the slider as a carousel, use the "Image Slider" module instead.', 'total-theme-core' ),
						'group' => esc_html__( 'Thumbnails', 'total-theme-core' ),
						'choices' => array(
							'6' => '6',
							'5' => '5',
							'4' => '4',
							'3' => '3',
							'2' => '2',
						),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Width', 'total-theme-core' ),
						'param_name' => 'img_thumb_width',
						'value' => '',
						'description' => esc_html__( 'Enter a width in pixels for your thumbnail image width. This won\'t increase the grid, its only used so you can alter the cropping to your preferred proportions.', 'total-theme-core' ),
						'group' => esc_html__( 'Thumbnails', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Height', 'total-theme-core' ),
						'param_name' => 'img_thumb_height',
						'value' => '',
						'description' => esc_html__( 'Enter a width in pixels for your thumbnail image height.', 'total-theme-core' ),
						'group' => esc_html__( 'Thumbnails', 'total-theme-core' ),
					),
					// Caption
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Enable', 'total-theme-core' ),
						'param_name' => 'caption',
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_visibility',
						'heading' => esc_html__( 'Visibility', 'total-theme-core' ),
						'param_name' => 'caption_visibility',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Based On Image', 'total-theme-core' ),
						'param_name' => 'caption_type',
						'std' => 'caption',
						'choices' => array(
							'caption' => esc_html__( 'Caption', 'total-theme-core' ),
							'title' => esc_html__( 'Title', 'total-theme-core' ),
							'description' => esc_html__( 'Description', 'total-theme-core' ),
							'alt' => esc_html__( 'Alt', 'total-theme-core' ),
						),
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Style', 'total-theme-core' ),
						'param_name' => 'caption_style',
						'std' => 'black',
						'choices' => array(
							'black' => esc_html__( 'Black', 'total-theme-core' ),
							'white' => esc_html__( 'White', 'total-theme-core' ),
						),
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Rounded?', 'total-theme-core' ),
						'param_name' => 'caption_rounded',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Position', 'total-theme-core' ),
						'param_name' => 'caption_position',
						'std' => 'bottomCenter',
						'value' => array(
							esc_html__( 'Bottom Center', 'total-theme-core' ) => 'bottomCenter',
							esc_html__( 'Bottom Left', 'total-theme-core' ) => 'bottomLeft',
							esc_html__( 'Bottom Right', 'total-theme-core' ) => 'bottomRight',
							esc_html__( 'Top Center', 'total-theme-core' ) => 'topCenter',
							esc_html__( 'Top Left', 'total-theme-core' ) => 'topLeft',
							esc_html__( 'Top Right', 'total-theme-core' ) => 'topRight',
							esc_html__( 'Center Center', 'total-theme-core' ) => 'centerCenter',
							esc_html__( 'Center Left', 'total-theme-core' ) => 'centerLeft',
							esc_html__( 'Center Right', 'total-theme-core' ) => 'centerRight',
						),
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Show Transition', 'total-theme-core' ),
						'param_name' => 'caption_show_transition',
						'std' => 'up',
						'value' => array(
							esc_html__( 'None', 'total-theme-core' ) => 'false',
							esc_html__( 'Up', 'total-theme-core' ) => 'up',
							esc_html__( 'Down', 'total-theme-core' ) => 'down',
							esc_html__( 'Left', 'total-theme-core' ) => 'left',
							esc_html__( 'Right', 'total-theme-core' ) => 'right',
						),
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Hide Transition', 'total-theme-core' ),
						'param_name' => 'caption_hide_transition',
						'std' => 'down',
						'value' => array(
							esc_html__( 'None', 'total-theme-core' ) => 'false',
							esc_html__( 'Up', 'total-theme-core' ) => 'up',
							esc_html__( 'Down', 'total-theme-core' ) => 'down',
							esc_html__( 'Left', 'total-theme-core' ) => 'left',
							esc_html__( 'Right', 'total-theme-core' ) => 'right',
						),
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Width', 'total-theme-core' ),
						'param_name' => 'caption_width',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'value' => '100%',
						'description' => esc_html__( 'Enter a pixel or percentage value. You can also enter "auto" for content dependent width.', 'total-theme-core' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Font-Size', 'total-theme-core' ),
						'param_name' => 'caption_font_size',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_trbl',
						'heading' => esc_html__( 'Padding', 'total-theme-core' ),
						'param_name' => 'caption_padding',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Horizontal Offset', 'total-theme-core' ),
						'param_name' => 'caption_horizontal',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
						'description' => esc_html__( 'Please enter a px value.', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Vertical Offset', 'total-theme-core' ),
						'param_name' => 'caption_vertical',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
						'description' => esc_html__( 'Please enter a px value.', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Delay', 'total-theme-core' ),
						'param_name' => 'caption_delay',
						'std' => '500',
						'dependency' => array( 'element' => 'caption', 'value' => 'true' ),
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
						'description' => esc_html__( 'Enter a value in milliseconds.', 'total-theme-core' ),
					),
					// Links
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Image Link', 'total-theme-core' ),
						'param_name' => 'thumbnail_link',
						'std' => 'none',
						'choices' => array(
							'none' => esc_html__( 'None', 'total-theme-core' ),
							'lightbox' => esc_html__( 'Lightbox', 'total-theme-core' ),
							'custom_link' => esc_html__( 'Custom', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
					),
					array(
						'type' => 'exploded_textarea',
						'heading' => esc_html__( 'Custom links', 'total-theme-core' ),
						'param_name' => 'custom_links',
						'description' => esc_html__( 'Enter links for each slide here. Divide links with linebreaks (Enter). For images without a link enter a # symbol.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => array( 'custom_link' ) ),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Target', 'total-theme-core' ),
						'param_name' => 'custom_links_target',
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'custom_link' ),
						'std' => 'self',
						'choices' => array(
							'self' => esc_html__( 'Self', 'total-theme-core' ),
							'_blank' => esc_html__( 'Blank', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Lightbox Thumbnails Placement', 'total-theme-core' ),
						'param_name' => 'lightbox_path',
						'std' => 'horizontal',
						'choices' => array(
							'horizontal' => esc_html__( 'Horizontal', 'total-theme-core' ),
							'vertical' => esc_html__( 'Vertical', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'lightbox' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Lightbox Title', 'total-theme-core' ),
						'param_name' => 'lightbox_title',
						'std' => 'none',
						'choices' => array(
							'none' => esc_html__( 'None', 'total-theme-core' ),
							'alt' => esc_html__( 'Alt', 'total-theme-core' ),
							'title' => esc_html__( 'Title', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'lightbox' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'enable',
						'vcex' => array(
							'on' => 'enable',
							'off' => 'false',
						),
						'heading' => esc_html__( 'Lightbox Caption', 'total-theme-core' ),
						'param_name' => 'lightbox_caption',
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'lightbox' ),
					),
					// CSS
					array(
						'type' => 'css_editor',
						'heading' => esc_html__( 'CSS', 'total-theme-core' ),
						'param_name' => 'css',
						'group' => esc_html__( 'Design', 'total-theme-core' ),
					),

				)
			);
		}

	}
}
new VCEX_Image_Gallery_Slider;