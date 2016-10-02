void CG_mvZoomBinoc( float x, float y, float w, float h ) {
	float ws = w / 640;
	float hs = h / 480;

	// an alternative.  This gives nice sharp lines at the 
    // expense of a few extra polys
	if ( cgs.media.binocShaderSimple ) {
		CG_DrawPic( x, y, 640.0f * ws, 480.0f * ws, 
            cgs.media.binocShaderSimple );
	}

	CG_FillRect( x + 146.0f * ws, y + 239.0f * hs, 
            348.0f * ws, 1, colorBlack );

	CG_FillRect( x + 188.0f * ws, y + 234.0f * hs, 
            1, 13.0f * hs, colorBlack );   // ll
	CG_FillRect( x + 234.0f * ws, y + 226.0f * hs, 
            1, 29.0f * hs, colorBlack );   // l
	CG_FillRect( x + 274.0f * ws, y + 234.0f * hs, 
            1, 13.0f * hs, colorBlack );   // lr
	CG_FillRect( x + 320.0f * ws, y + 213.0f * hs, 
            1, 55.0f * hs, colorBlack );   // center
	CG_FillRect( x + 360.0f * ws, y + 234.0f * hs, 
            1, 13.0f * hs, colorBlack );   // rl
	CG_FillRect( x + 406.0f * ws, y + 226.0f * hs, 
            1, 29.0f * hs, colorBlack );   // r
	CG_FillRect( x + 452.0f * ws, y + 234.0f * hs, 
            1, 13.0f * hs, colorBlack );   // rr
}
