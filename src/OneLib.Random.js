/**
 * Created by cuikai on 2015/12/7.
 */

define('OneLib.Random', [], function (require, exports, module) {

    /**
     * 生成一组根据weights数组指定的权重的数字
     * @param weights，权重参数表，比如1,1.则代表生成的数字会均匀分散在[0,0.5][0.5,1]2个区间中
     * @returns {*}
     */
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