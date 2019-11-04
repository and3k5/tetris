export class vec2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    static add(a,b) {
        return new vec2(a.x + b.x, a.y + b.y);
    }

    static sub(a,b) {
        return new vec2(a.x - b.x, a.y - b.y);
    }

    static mul(a,b) {
        return new vec2(a.x * b.x, a.y * b.y);
    }

    static div(a,b) {
        return new vec2(a.x / b.x, a.y / b.y);
    }

    get xy() {
        return new vec2(this.x,this.y);
    }
}

export class vec3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static add(a,b) {
        return new vec2(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static sub(a,b) {
        return new vec2(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static mul(a,b) {
        return new vec2(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static div(a,b) {
        return new vec2(a.x / b.x, a.y / b.y, a.z / b.z);
    }

    get xy() {
        return new vec2(this.x,this.y);
    }
}

class mat2 {
    constructor(a,b,c,d) {
        this.data = [a,b,c,d];
    }
}

const iResolution = new vec3(1,1,1);

const floor = Math.floor.bind(Math);
const max = Math.max.bind(Math);

const iTime = 0;

function mod(a,b) {
    return a%b;
}

function dot() {
    var x1, y1, x2, y2;

    if (arguments.length === 2 && typeof(arguments[0]) === "number" && typeof(arguments[1]) === "number") {
        x1 = 0;
        y1 = 0;
        x2 = arguments[0];
        y2 = arguments[1];
    }
    //else if (arguments.length === 2 && arguments[0] instanceof vec2)
    else 
    throw new Error("not implemented");

    var a = x1 - x2;
    var b = y1 - y2;

    return a*a + b*b
}

/**
 * 
 * @param {vec2} p 
 * @returns {vec2}
 */
function hash(p) {
    p = new vec2(dot(p, new vec2(127.1, 311.7)),
        dot(p, new vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

/**
 * @param {vec2} p
 * @returns {float}
 */
function noise(p) {
    const K1 = 0.366025404; // (sqrt(3)-1)/2;
    const K2 = 0.211324865; // (3-sqrt(3))/6;

    /**
     * @type {vec2}
     */
    var i = floor(p + (p.x + p.y) * K1);

    /**
     * @type {vec2}
     */
    var a = p - i + (i.x + i.y) * K2;

    /**
     * @type {vec2}
     */
    var o = (a.x > a.y) ? new vec2(1.0, 0.0) : new vec2(0.0, 1.0);

    /**
     * @type {vec2}
     */
    var b = a - o + K2;

    /**
     * @type {vec2}
     */
    var c = a - 1.0 + 2.0 * K2;

    /**
     * @type {vec3}
     */
    var h = max(0.5 - new vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);

    /**
     * @type {vec3}
     */
    var n = h * h * h * h * new vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));

    return dot(n, new vec3(70.0));
}

/**
 * 
 * @param {vec2} uv 
 * @returns {float}
 */
function fbm(uv) {
    var f;
    /**
     * @type {mat2}
     */
    var m = new mat2(1.6, 1.2, -1.2, 1.6);
    f = 0.5000 * noise(uv); uv = m * uv;
    f += 0.2500 * noise(uv); uv = m * uv;
    f += 0.1250 * noise(uv); uv = m * uv;
    f += 0.0625 * noise(uv); uv = m * uv;
    f = 0.5 + 0.5 * f;
    return f;
}

//#define BLUE_FLAME
//#define GREEN_FLAME

/**
 * 
 * @param {vec4} fragColor 
 * @param {vec2} fragCoord 
 */
export function mainImage(fragColor, fragCoord) {
    /**
     * @type {vec2}
     */
    var uv = vec2.div(fragCoord.xy,iResolution.xy);

    /**
     * @type {mat2}
     */
    var q = uv;
    q.x *= 5.;
    q.y *= 2.;

    var strength = floor(q.x + 1.);
    var T3 = max(3., 1.25 * strength) * iTime;
    q.x = mod(q.x, 1.) - 0.5;
    q.y -= 0.25;

    var n = fbm(strength * q - new vec2(0, T3));
    var c = 1. - 16. * pow(max(0., length(q * new vec2(1.8 + q.y * 1.5, .75)) - n * max(0., q.y + .25)), 1.2);
    //	var c1 = n * c * (1.5-pow(1.25*uv.y,4.));
    var c1 = n * c * (1.5 - pow(2.50 * uv.y, 4.));
    c1 = clamp(c1, 0., 1.);

    /**
     * @type {vec3}
     */
    var col = new vec3(1.5 * c1, 1.5 * c1 * c1 * c1, c1 * c1 * c1 * c1 * c1 * c1);

    // #ifdef BLUE_FLAME
    // 	col = col.zyx;
    // #endif
    // #ifdef GREEN_FLAME
    // 	col = 0.85*col.yxz;
    // #endif

    var a = c * (1. - pow(uv.y, 3.));
    fragColor = vec4(mix(new vec3(0.), col, a), 1.0);
}