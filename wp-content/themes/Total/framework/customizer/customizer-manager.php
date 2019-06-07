<?php
/**
 * Customizer Manager
 *
 * @package Total WordPress Theme
 * @subpackage Customizer
 * @version 4.9
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPEX_Customizer_Manager' ) ) {

	class WPEX_Customizer_Manager extends WPEX_Customizer {

		public $page_name;

		/**
		 * Start things up
		 *
		 * @since 3.0.0
		 */
		public function __construct() {
			$this->page_name = esc_html__( 'Customizer Manager', 'total' );
			add_action( 'admin_menu', array( $this, 'add_admin_page' ), 40 );
			add_action( 'admin_init', array( $this,'admin_options' ) );
		}

		/**
		 * Add sub menu page for the custom CSS input
		 *
		 * @since 3.0.0
		 */
		public function add_admin_page() {
			add_submenu_page(
				WPEX_THEME_PANEL_SLUG,
				$this->page_name,
				$this->page_name,
				'administrator',
				WPEX_THEME_PANEL_SLUG .'-customizer',
				array( $this, 'create_admin_page' )
			);
		}

		/**
		 * Function that will register admin page options.
		 *
		 * @since 3.0.0
		 */
		public function admin_options() {
			register_setting( 'wpex_customizer_editor', 'wpex_customizer_panels' );
		}

		/**
		 * Settings page output
		 *
		 * @since 3.0.0
		 *
		 */
		public function create_admin_page() { ?>

			<div id="wpex-customizer-manager-admin-page" class="wrap">

				<h1><?php echo esc_html( $this->page_name ); ?> <a href="#" id="wpex-help-toggle" aria-hidden="true"><span class="dashicons dashicons-editor-help" aria-hidden="true"></span><span class="screen-reader-text"><?php esc_html_e( 'learn more', 'total' ); ?></span></a></h1>

				<div id="wpex-notice" class="wpex-help-notice notice notice-info">
					<p><?php esc_html_e( 'The Customizer Manager can be used to hide sections from the Customizer. It will not disable or alter any theme options already set in the Customizer or sections visible on the front-end of your site.', 'total' ); ?></p>
				</div>

				<h2 class="nav-tab-wrapper">
					<a href="#" class="nav-tab nav-tab-active"><?php esc_html_e( 'Enable Panels', 'total' ); ?></a>
					<a href="<?php echo esc_url( admin_url( 'customize.php' ) ); ?>" class="nav-tab"><?php esc_html_e( 'Customizer', 'total' ); ?><span class="dashicons dashicons-external"></span></a>
				</h2>

				<div class="wpex-check-uncheck">
					<a href="#" class="wpex-customizer-check-all"><?php esc_html_e( 'Check all', 'total' ); ?></a> | <a href="#" class="wpex-customizer-uncheck-all"><?php esc_html_e( 'Uncheck all', 'total' ); ?></a>
				</div>

				<form method="post" action="options.php">

					<?php settings_fields( 'wpex_customizer_editor' ); ?>

					<table class="form-table wpex-customizer-editor-table">
						<?php
						// Get panels
						$panels = $this->panels();

						// Check if post types are enabled
						$post_types = wpex_theme_post_types();

						// Get options and set defaults
						$options = get_option( 'wpex_customizer_panels', $panels );

						// Loop through panels and add checkbox
						foreach ( $panels as $id => $val ) {

							// Parse panel data
							$title     = isset( $val['title'] ) ? $val['title'] : $val;
							$condition = isset( $val['condition'] ) ? $val['condition'] : true;

							// Get option
							$option = isset( $options[$id] ) ? 'on' : false;

							// Display option if condition is met
							if ( $condition ) { ?>

								<tr valign="top">
									<th scope="row"><?php echo esc_html( $title ); ?></th>
									<td>
										<fieldset>
											<input class="wpex-customizer-editor-checkbox" type="checkbox" name="wpex_customizer_panels[<?php echo esc_attr( $id ); ?>]"<?php checked( $option, 'on' ); ?>>
										</fieldset>
									</td>
								</tr>

							<?php }

							// Condition isn't met so add it as a hidden item
							else { ?>

								<input type="hidden" name="wpex_customizer_panels[<?php echo esc_attr( $id ); ?>]"<?php checked( $option, 'on' ); ?>>

							<?php } ?>

						<?php } ?>

					</table>

					<?php submit_button(); ?>

				</form>

			</div><!-- .wrap -->

		<?php }

	}

}
new WPEX_Customizer_Manager;