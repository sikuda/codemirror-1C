<?php

/*
  Plugin Name: CodeMirror for 1C
  Plugin URI: http://code1c.sikuda.ru
  Description: Highlight your code 1C on Wordpress!
  Version: 0.1
  Author: Serg Kudashkin
  Author URI: http://code1c.sikuda.ru
*/

add_action( 'wp_enqueue_scripts', 'wpsites_add_codemirror1c' );

function wpsites_add_codemirror1c() {
  if ( ! is_admin() ) {
	  
	  //base
	  wp_enqueue_script( 'codemirror', plugins_url( 'lib/codemirror.js', __FILE__ ), '', '', true );
      wp_enqueue_style( 'codemirror', plugins_url( 'lib/codemirror.css', __FILE__ ) );
	  
	  //add on for 1c
      wp_enqueue_script( 'codemirror1c', plugins_url( 'mode/1c/1c.js', __FILE__ ), '', '', true );
      wp_enqueue_style( 'codemirror1c', plugins_url( 'theme/1c.css', __FILE__ ) );
	  
	  //handle of textara class codemirror
	  wp_enqueue_script( 'codemirrorAdd', plugins_url( 'codemirror1c.js', __FILE__ ), '', '', true  );
  }
}

add_shortcode( 'codemirror1c', 'codemirror1c_func' );

function codemirror1c_func( $atts, $content ) {
	$html =  "<textarea class='codemirror1c'>".$content."</textarea>";
	//$html .= "<div align='center'><input type='button' onclick=''  value='Копировать' style='font-size:1em' ></button></div>";
    return $html;
}