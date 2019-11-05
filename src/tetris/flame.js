export class vec2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    static add(a,b) {
        if (typeof(a) === "number") {
            return new vec2(a + b.x, a + b.y);
        }
        if (typeof(b) === "number") {
            return new vec2(a.x + b, a.y + b);
        }
        return new vec2(a.x + b.x, a.y + b.y);
    }

    static sub(a,b) {
        if (typeof(a) === "number") {
            return new vec2(a - b.x, a - b.y);
        }
        if (typeof(b) === "number") {
            return new vec2(a.x - b, a.y - b);
        }
        return new vec2(a.x - b.x, a.y - b.y);
    }

    static mul(a,b) {
        if (typeof(a) === "number") {
            return new vec2(a * b.x, a * b.y);
        }
        if (typeof(b) === "number") {
            return new vec2(a.x * b, a.y * b);
        }
        return new vec2(a.x * b.x, a.y * b.y);
    }

    static div(a,b) {
        if (typeof(a) === "number") {
            return new vec2(a / b.x, a / b.y);
        }
        if (typeof(b) === "number") {
            return new vec2(a.x / b, a.y / b);
        }
        return new vec2(a.x / b.x, a.y / b.y);
    }

    static operator(a,b,fnc) {
        if (typeof(a) === "number") {
            return new vec2(fnc(a,b.x), fnc(a, b.y));
        }
        if (typeof(b) === "number") {
            return new vec2(fnc(a.x , b), fnc(a.y , b));
        }
        return new vec2(fnc(a.x , b.x), fnc(a.y , b.y));
    }

    static clamp(x, minVal, maxVal) {
        return vec2.operator(vec2.operator(x,minVal,(a,b) => Math.max(a,b)),maxVal,(a,b) => Math.min(a,b));
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static pow(a,b) {
        return vec2.operator(a,b,(a,b) => Math.pow(a,b));
    }

    floor() {
        return new vec2(floor(this.x), floor(this.y));
    }

    get xy() {
        return new vec2(this.x,this.y);
    }

    dot(b) {
        return this.x * b.x + this.y * b.y;
    }

    sin() {
        return new vec2(sin(this.x), sin(this.y));
    }
}

export class vec3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static add(a,b) {
        if (typeof(a) === "number") {
            return new vec3(a + b.x, a + b.y, a + b.z);
        }
        if (typeof(b) === "number") {
            return new vec3(a.x + b, a.y + b, a.z + b);
        }
        return new vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static sub(a,b) {
        if (typeof(a) === "number") {
            return new vec3(a - b.x, a - b.y, a - b.z);
        }
        if (typeof(b) === "number") {
            return new vec3(a.x - b, a.y - b, a.z - b);
        }
        return new vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static mul(a,b) {
        if (typeof(a) === "number") {
            return new vec3(a * b.x, a * b.y, a * b.z);
        }
        if (typeof(b) === "number") {
            return new vec3(a.x * b, a.y * b, a.z * b);
        }
        return new vec3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static div(a,b) {
        if (typeof(a) === "number") {
            return new vec3(a / b.x, a / b.y, a / b.z);
        }
        if (typeof(b) === "number") {
            return new vec3(a.x / b, a.y / b, a.z / b);
        }
        return new vec3(a.x / b.x, a.y / b.y, a.z / b.z);
    }

    static operator(a,b,fnc) {
        if (typeof(a) === "number") {
            return new vec3(fnc(a,b.x), fnc(a, b.y), fnc(a , b.z));
        }
        if (typeof(b) === "number") {
            return new vec3(fnc(a.x , b), fnc(a.y , b), fnc(a.z , b));
        }
        return new vec3(fnc(a.x , b.x), fnc(a.y , b.y), fnc(a.z , b.z));
    }

    static clamp(x, minVal, maxVal) {
        return vec3.operator(vec3.operator(x,minVal,(a,b) => Math.max(a,b)),maxVal,(a,b) => Math.min(a,b));
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static pow(a,b) {
        return vec3.operator(a,b,(a,b) => Math.pow(a,b));
    }

    floor() {
        return new vec3(floor(this.x), floor(this.y), floor(this.z));
    }

    get xy() {
        return new vec2(this.x,this.y);
    }

    dot(b) {
        return this.x * b.x + this.y * b.y + this.z * b.z;
    }

    sin() {
        return new vec3(sin(this.x), sin(this.y), sin(this.z));
    }
}

class mat2 {
    constructor(a,b,c,d) {
        this.data = [a,b,c,d];
    }
}

function add(a,b) {
    if (a instanceof vec2 && b instanceof vec2) {
        return vec2.add(a, b);
    }
    else if (a instanceof vec3 && b instanceof vec3) {
        return vec3.add(a, b);
    } else if (typeof (a) === "number" && typeof (b) === "number") {
        return a + b;
    } else if (typeof (a) === "number" && b instanceof vec2) {
        return vec2.add(a,b);
    } else if (a instanceof vec2 && typeof (b) === "number") {
        return vec2.add(a,b);
    }else{
        var aType = typeof(a);
        if (aType == "object")
            aType = a.constructor.name;

        var bType = typeof(b);
        if (bType == "object")
            bType = b.constructor.name;

        throw new Error("unsupported: "+aType+ " + "+bType);
    }
}

function length(x) {
    if (typeof(x) === "number")
        return Math.abs(x);
    else if (x instanceof vec2)
        return x.length();
    else if (x instanceof vec3)
        return x.length();
    throw new Error("unsupported length");
}

function clamp(x, minVal, maxVal) {
    if (typeof(x) === "number")
        return Math.max(minVal,Math.min(maxVal,x));
    else if (x instanceof vec2)
        return vec2.clamp(x,minVal,maxVal);
    else if (x instanceof vec3)
        return vec3.clamp(x,minVal,maxVal);
    throw new Error("unsupported length");
}

function mul(a,b) {
    if (a instanceof vec2 && b instanceof vec2) {
        return vec2.mul(a,b);
    }
    else if (a instanceof vec3 && b instanceof vec3) {
        return vec3.mul(a,b);
    }else if (typeof(a) === "number" && typeof(b) === "number")
    {
        return a*b;
    } else if (typeof (a) === "number" && b instanceof vec2) {
        return vec2.mul(a,b);
    } else if (a instanceof vec2 && typeof (b) === "number") {
        return vec2.mul(a,b);
    }else{
        var aType = typeof(a);
        if (aType == "object")
            aType = a.constructor.name;

        var bType = typeof(b);
        if (bType == "object")
            bType = b.constructor.name;

        throw new Error("unsupported: "+aType+ " + "+bType);
    }
}

function sub(a,b) {
    if (a instanceof vec2 && b instanceof vec2) {
        return vec2.sub(a,b);
    }
    else if (a instanceof vec3 && b instanceof vec3) {
        return vec3.sub(a,b);
    }else if (typeof(a) === "number" && typeof(b) === "number")
    {
        return a-b;
    } else if (typeof (a) === "number" && b instanceof vec2) {
        return vec2.sub(a,b);
    } else if (a instanceof vec2 && typeof (b) === "number") {
        return vec2.sub(a,b);
    }else{
        var aType = typeof(a);
        if (aType == "object")
            aType = a.constructor.name;

        var bType = typeof(b);
        if (bType == "object")
            bType = b.constructor.name;

        throw new Error("unsupported: "+aType+ " + "+bType);
    }
}

function pow(a,b) {
    if (a instanceof vec2 && b instanceof vec2) {
        return vec2.pow(a,b);
    }
    else if (a instanceof vec3 && b instanceof vec3) {
        return vec3.pow(a,b);
    }else if (typeof(a) === "number" && typeof(b) === "number")
    {
        return Math.pow(a,b);
    } else if (typeof (a) === "number" && b instanceof vec2) {
        return vec2.pow(a,b);
    } else if (a instanceof vec2 && typeof (b) === "number") {
        return vec2.pow(a,b);
    }else{
        var aType = typeof(a);
        if (aType == "object")
            aType = a.constructor.name;

        var bType = typeof(b);
        if (bType == "object")
            bType = b.constructor.name;

        throw new Error("unsupported: "+aType+ " + "+bType);
    }
}

const iResolution = new vec3(1,1,1);

function floor(v) {
    if (typeof(v) === "number")
        return Math.floor(v);
    if (v instanceof vec2)
        return v.floor();
    if (v instanceof vec3)
        return v.floor();
    throw new Exception("cannot use floor on unknown value");

}

function fract(x) {
    if (typeof(x) === "number")
        return x - floor(x);
    if (x instanceof vec2)
        return vec2.sub(x,floor(x));
    if (x instanceof vec3)
        return vec3.sub(x,floor(x));
    throw new Error("unsupported fract");
}

function sin(x) {
    if (typeof(x) === "number")
        return Math.sin(x);
    if (x instanceof vec2)
        return x.sin();
    if (x instanceof vec3)
        return x.sin();
    throw new Error("unsupported fract");
}

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
    else if (arguments.length === 2 && arguments[0] instanceof vec2 && arguments[1] instanceof vec2) {
        return arguments[0].dot(arguments[1]);
    }
    else if (arguments.length === 2 && arguments[0] instanceof vec3 && arguments[1] instanceof vec3) {
        return arguments[0].dot(arguments[1]);
    }
    else 
    throw new Error("not implemented: "+arguments[0]);

    var a = x1 - x2;
    var b = y1 - y2;

    return a*a + b*b;
}

/**
 * 
 * @param {vec2} p 
 * @returns {vec2}
 */
function hash(p) {
    p = new vec2(dot(p, new vec2(127.1, 311.7)),
        dot(p, new vec2(269.5, 183.3)));
    var out = add(-1.0,mul(2.0, fract(mul(sin(p), 43758.5453123))));
    return out;
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
    var i = floor(add(p,mul(add(p.x,p.y),K1)));

    /**
     * @type {vec2}
     */
    var a = vec2.sub(p,add(i , mul(add(i.x , i.y), K2)));

    /**
     * @type {vec2}
     */
    var o = (a.x > a.y) ? new vec2(1.0, 0.0) : new vec2(0.0, 1.0);

    /**
     * @type {vec2}
     */
    var b = vec2.add(vec2.sub(a , o), K2);

    /**
     * @type {vec2}
     */
    var c = vec2.add(vec2.sub(a , 1.0) , (2.0 * K2));

    /**
     * @type {vec3}
     */
    var h = max(vec3.sub(0.5,new vec3(dot(a, a), dot(b, b), dot(c, c))), 0.0);

    /**
     * @type {vec3}
     */
    
    var n = vec3.mul(vec3.mul(vec3.mul(vec3.mul(h,h),h),h),new vec3(dot(a, hash(vec2.add(i,0.0))), dot(b, hash(vec2.add(i,o))), dot(c, hash(vec2.add(i, 1.0)))));

    return dot(n, new vec3(70.0));
}

function mix(x,y,a) {
    if (typeof(x) === "number" && typeof(y) === "number" && typeof(a) === "number") {
        // TODO implement
    }
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
    f = vec2.mul(0.5000 , noise(uv)); uv = vec2.mul(m , uv);
    f = vec2.add(f,vec2.mul(0.2500 , noise(uv))); uv = vec2.mul(m , uv);
    f = vec2.add(f,vec2.mul(0.1250 , noise(uv))); uv = vec2.mul(m , uv);
    f = vec2.add(f,vec2.mul(0.0625 , noise(uv))); uv = vec2.mul(m , uv);
    f = vec2.add(0.5 , vec2.mul(0.5, f));
    return f;
}

//#define BLUE_FLAME
//#define GREEN_FLAME

/**
 * 
 * @param {vec4} fragColor 
 * @param {vec2} fragCoord 
 */
export function mainImage(fragCoord) {
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

    var n = fbm(sub(mul(strength , q),(new vec2(0, T3))));
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
    return mix(new vec3(0.), col, a);
}