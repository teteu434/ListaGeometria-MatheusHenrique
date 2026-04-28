// Questão 4 - Implementação de Vec4 e Mat4 (os 2 utilitários para computação gráfica)

class Vec4 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(v) {
        return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }

    sub(v) {
        return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }

    scale(s) {
        return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s);
    }

    static fromPoints(p1, p2) {
        return new Vec4(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z, 0);
    }

    norm() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    normalize() {
        const n = this.norm();
        return n === 0 ? new Vec4(0,0,0,this.w) : this.scale(1/n);
    }

    dot(v) {
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    cross(v) {
        return new Vec4(
            this.y*v.z - this.z*v.y,
            this.z*v.x - this.x*v.z,
            this.x*v.y - this.y*v.x,
            0
        );
    }

    angle(v) {
        const c = this.dot(v) / (this.norm() * v.norm());
        return Math.acos(Math.min(1, Math.max(-1, c)));
    }

    affine(v, t) {
        return this.scale(1 - t).add(v.scale(t));
    }
}


class Mat4 {
    constructor() {
        this.m = new Float32Array(16);
        this.identity();
    }

    identity() {
        this.m.fill(0);
        this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1;
        return this;
    }

    translate(tx, ty, tz) {
        this.identity();
        this.m[12] = tx;
        this.m[13] = ty;
        this.m[14] = tz;
        return this;
    }

    scale(sx, sy, sz) {
        this.identity();
        this.m[0] = sx;
        this.m[5] = sy;
        this.m[10] = sz;
        return this;
    }

    rotateX(a) {
        const c = Math.cos(a), s = Math.sin(a);
        this.identity();
        this.m[5] = c;  this.m[6] = s;
        this.m[9] = -s; this.m[10] = c;
        return this;
    }

    rotateY(a) {
        const c = Math.cos(a), s = Math.sin(a);
        this.identity();
        this.m[0] = c;  this.m[2] = -s;
        this.m[8] = s;  this.m[10] = c;
        return this;
    }

    rotateZ(a) {
        const c = Math.cos(a), s = Math.sin(a);
        this.identity();
        this.m[0] = c;  this.m[1] = s;
        this.m[4] = -s; this.m[5] = c;
        return this;
    }

    multiply(b) {
        const r = new Mat4();
        const a = this.m, m = b.m, o = r.m;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                o[j + i*4] =
                    a[i*4 + 0]*m[j + 0] +
                    a[i*4 + 1]*m[j + 4] +
                    a[i*4 + 2]*m[j + 8] +
                    a[i*4 + 3]*m[j + 12];
            }
        }
        return r;
    }

    ortho(l, r, b, t, n, f) {
        this.identity();
        this.m[0] = 2/(r-l);
        this.m[5] = 2/(t-b);
        this.m[10] = -2/(f-n);
        this.m[12] = -(r+l)/(r-l);
        this.m[13] = -(t+b)/(t-b);
        this.m[14] = -(f+n)/(f-n);
        return this;
    }

    perspective(fovY, aspect, n, f) {
        const d = 1 / Math.tan(fovY/2);
        this.m.fill(0);
        this.m[0] = d/aspect;
        this.m[5] = d;
        this.m[10] = (f+n)/(n-f);
        this.m[11] = -1;
        this.m[14] = (2*f*n)/(n-f);
        return this;
    }

    asFloat32Array() {
        return this.m;
    }
}