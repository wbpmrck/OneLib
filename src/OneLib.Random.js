/**
 * Created by cuikai on 2015/12/7.
 */

define('OneLib.Random', [], function (require, exports, module) {

    function randomFor( weights ){
        if( arguments.length > 1 ){
            weights = [].slice.call( arguments );
        }

        var total, current = 0, parts = [],
            i = 0, l = weights.length;

        // reduce 方法的简单兼容
        total = weights.reduce ? weights.reduce( function( a, b ){
            return a + b;
        } ) : eval( weights.join( '+' ) );

        for( ; i < l; i ++ ){
            current += weights[ i ];
            parts.push( 'if( p < ', current / total, ' ) return ', i / l, ' + n;' );
        }

        return Function( 'var p = Math.random(), n = Math.random() / ' + l + ';' + parts.join( '' ) );
    }

    return {
      randomFor:randomFor
    }

});