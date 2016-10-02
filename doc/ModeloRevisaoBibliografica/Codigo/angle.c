void AngleVectors (const vec3_t angles, vec3_t forward, 
    vec3_t right, vec3_t up) 
{
	float angle;
	static float sr, sp, sy, cr, cp, cy;

	angle = angles[YAW] * (M_PI * 2 / 360);
	sy = sin(angle);
	cy = cos(angle);

	angle = angles[PITCH] * (M_PI*2/360);
	sp = sin(angle);
	cp = cos(angle);

	angle = angles[ROLL] * (M_PI*2/360);
	sr = sin(angle);
	cr = cos(angle);

	if (forward) {
		forward[0] = cp * cy;
		forward[1] = cp * sy;
		forward[2] = -sp;
	}
	if (right) {
		right[0] = (-1*sr*sp*cy + -1*cr*-sy);
		right[1] = (-1*sr*sp*sy + -1*cr*cy);
		right[2] = -1 * sr * cp;
	}
	if (up) {
		up[0] = (cr*sp*cy + -sr*-sy);
		up[1] = (cr*sp*sy + -sr*cy);
		up[2] = cr*cp;
	}
}
