/**
 * Moved this function from CrystalBuilder.
 *
 * @author  Ikaros Kappler
 * @date    2017-12-21
 * @version 1.0.0
 **/

// +-------------------------------------------------------------------------
// | A helper function to convert degrees to radians.
// +-------------------------------------------------
function deg2rad( rotation ) {
    var DEG_TO_RAD = Math.PI/180.0;
    return { x : rotation.x*DEG_TO_RAD, y : rotation.y*DEG_TO_RAD, z : rotation.z*DEG_TO_RAD };
}
