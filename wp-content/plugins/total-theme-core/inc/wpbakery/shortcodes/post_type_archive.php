<?php
/**
 * Post Type Archive
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'VCEX_Post_Type_Archive_Shortcode' ) ) {

	class VCEX_Post_Type_Archive_Shortcode {

		/**
		 * Define shortcode name.
		 */
		public $shortcode = 'vcex_post_type_archive';

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

			if ( is_admin() ) {

				// Get autocomplete suggestion
				add_filter(
					'vc_autocomplete_vcex_post_type_archive_tax_query_taxonomy_callback',
					'vcex_suggest_taxonomies'
				);
				add_filter(
					'vc_autocomplete_vcex_post_type_archive_tax_query_terms_callback',
					'vcex_suggest_terms'
				);
				add_filter(
					'vc_autocomplete_vcex_post_type_archive_author_in_callback',
					'vcex_suggest_users'
				);

				// Render autocomplete suggestions
				add_filter(
					'vc_autocomplete_vcex_post_type_archive_tax_query_taxonomy_render',
					'vcex_render_taxonomies' );
				add_filter(
					'vc_autocomplete_vcex_post_type_archive_tax_query_terms_render',
					'vcex_render_terms'
				);
				add_filter(
					'vc_autocomplete_vcex_post_type_archive_author_in_render',
					'vcex_render_users'
				);

			}

		}

		/**
		 * Map shortcode to VC
		 *
		 * @since 3.5.0
		 */
		public function map() {
			$post_types = array();
			if ( is_admin() ) {
				$post_types = vcex_get_post_types();
			}
			return array(
				'name' => esc_html__( 'Post Types Archive', 'total-theme-core' ),
				'description' => esc_html__( 'Custom post type archive', 'total-theme-core' ),
				'base' => $this->shortcode,
				'category' => vcex_shortcodes_branding(),
				'icon' => 'vcex-post-type-grid vcex-icon ticon ticon-files-o',
				'params' => array(
					// General
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Heading', 'total-theme-core' ),
						'param_name' => 'heading',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Unique Id', 'total-theme-core' ),
						'param_name' => 'unique_id',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Extra class name', 'total-theme-core' ),
						'description' => esc_html__( 'Style particular content element differently - add a class name and refer to it in custom CSS.', 'total-theme-core' ),
						'param_name' => 'classes',
					),
					array(
						'type' => 'vcex_visibility',
						'heading' => esc_html__( 'Visibility', 'total-theme-core' ),
						'param_name' => 'visibility',
					),
					vcex_vc_map_add_css_animation(),
					// Query
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Advanced Query?', 'total-theme-core' ),
						'param_name' => 'custom_query',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'description' => esc_html__( 'Enable to build a custom query using your own parameter string.', 'total-theme-core' ),
					),
					array(
						'type' => 'textarea_safe',
						'heading' => esc_html__( 'Custom query', 'total-theme-core' ),
						'param_name' => 'custom_query_args',
						'description' => esc_html__( 'Build custom query according to <a href="http://codex.wordpress.org/Function_Reference/query_posts" target="_blank">WordPress Codex</a>.', 'total-theme-core' ),
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'true' ) ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Post Type', 'total-theme-core' ),
						'param_name' => 'post_type',
						'value' => $post_types,
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Order', 'total-theme-core' ),
						'param_name' => 'order',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'value' => array(
							esc_html__( 'Default', 'total-theme-core' ) => '',
							esc_html__( 'DESC', 'total-theme-core' ) => 'DESC',
							esc_html__( 'ASC', 'total-theme-core' ) => 'ASC',
						),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Order By', 'total-theme-core' ),
						'param_name' => 'orderby',
						'value' => vcex_orderby_array(),
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Orderby: Meta Key', 'total-theme-core' ),
						'param_name' => 'orderby_meta_key',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array(
							'element' => 'orderby',
							'value' => array( 'meta_value_num', 'meta_value' ),
						),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Offset', 'total-theme-core' ),
						'param_name' => 'offset',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'description' => esc_html__( 'Number of post to displace or pass over. Warning: Setting the offset parameter overrides/ignores the paged parameter and breaks pagination. The offset parameter is ignored when posts per page is set to -1.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Posts Per Page', 'total-theme-core' ),
						'param_name' => 'posts_per_page',
						'value' => '12',
						'description' => esc_html__( 'You can enter "-1" to display all posts.', 'total-theme-core' ),
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Query by Taxonomy', 'total-theme-core' ),
						'param_name' => 'tax_query',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'autocomplete',
						'heading' => esc_html__( 'Taxonomy Name', 'total-theme-core' ),
						'param_name' => 'tax_query_taxonomy',
						'settings' => array(
							'multiple' => false,
							'min_length' => 1,
							'groups' => false,
							//'unique_values' => true,
							'display_inline' => true,
							'delay' => 0,
							'auto_focus' => true,
						),
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'description' => esc_html__( 'If you do not see your taxonomy in the dropdown you can still enter the taxonomy name manually.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'tax_query', 'value' => array( 'true' ) ),
					),
					array(
						'type' => 'autocomplete',
						'heading' => esc_html__( 'Terms', 'total-theme-core' ),
						'param_name' => 'tax_query_terms',
						'dependency' => array(
							'element' => 'tax_query',
							'value' => 'true',
						),
						'settings' => array(
							'multiple' => true,
							'min_length' => 1,
							'groups' => true,
							//'unique_values' => true,
							'display_inline' => true,
							'delay' => 0,
							'auto_focus' => true,
						),
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'description' => esc_html__( 'If you do not see your terms in the dropdown you can still enter the term slugs manually seperated by a space.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'tax_query', 'value' => array( 'true' ) ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Post With Thumbnails Only', 'total-theme-core' ),
						'param_name' => 'thumbnail_query',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Pagination', 'total-theme-core' ),
						'param_name' => 'pagination',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Load More Button', 'total-theme-core' ),
						'param_name' => 'pagination_loadmore',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Limit By Post ID\'s', 'total-theme-core' ),
						'param_name' => 'posts_in',
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'description' => esc_html__( 'Seperate by a comma.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
					array(
						'type' => 'autocomplete',
						'heading' => esc_html__( 'Limit By Author', 'total-theme-core' ),
						'param_name' => 'author_in',
						'settings' => array(
							'multiple' => true,
							'min_length' => 1,
							'groups' => false,
							'unique_values' => true,
							'display_inline' => true,
							'delay' => 0,
							'auto_focus' => true,
						),
						'group' => esc_html__( 'Query', 'total-theme-core' ),
						'dependency' => array( 'element' => 'custom_query', 'value' => array( 'false' ) ),
					),
				)
			);
		}

	}
}
new VCEX_Post_Type_Archive_Shortcode;