"use strict";
(self.webpackChunkFRONT = self.webpackChunkFRONT || []).push([
  [179],
  {
    755: () => {
      function re(e) {
        return "function" == typeof e;
      }
      function mo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const yo = mo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function gr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class yt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (re(r))
              try {
                r();
              } catch (i) {
                t = i instanceof yo ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Uu(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof yo ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new yo(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Uu(t);
            else {
              if (t instanceof yt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && gr(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && gr(n, t), t instanceof yt && t._removeParent(this);
        }
      }
      yt.EMPTY = (() => {
        const e = new yt();
        return (e.closed = !0), e;
      })();
      const Hu = yt.EMPTY;
      function $u(e) {
        return (
          e instanceof yt ||
          (e && "closed" in e && re(e.remove) && re(e.add) && re(e.unsubscribe))
        );
      }
      function Uu(e) {
        re(e) ? e() : e.unsubscribe();
      }
      const un = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Do = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Do;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Do;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Gu(e) {
        Do.setTimeout(() => {
          const { onUnhandledError: t } = un;
          if (!t) throw e;
          t(e);
        });
      }
      function zu() {}
      const sD = os("C", void 0, void 0);
      function os(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let cn = null;
      function vo(e) {
        if (un.useDeprecatedSynchronousErrorHandling) {
          const t = !cn;
          if ((t && (cn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = cn;
            if (((cn = null), n)) throw r;
          }
        } else e();
      }
      class is extends yt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), $u(t) && t.add(this))
              : (this.destination = hD);
        }
        static create(t, n, r) {
          return new mr(t, n, r);
        }
        next(t) {
          this.isStopped
            ? as(
                (function lD(e) {
                  return os("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? as(
                (function aD(e) {
                  return os("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? as(sD, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const cD = Function.prototype.bind;
      function ss(e, t) {
        return cD.call(e, t);
      }
      class dD {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              _o(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              _o(r);
            }
          else _o(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              _o(n);
            }
        }
      }
      class mr extends is {
        constructor(t, n, r) {
          let o;
          if ((super(), re(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && un.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && ss(t.next, i),
                  error: t.error && ss(t.error, i),
                  complete: t.complete && ss(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new dD(o);
        }
      }
      function _o(e) {
        un.useDeprecatedSynchronousErrorHandling
          ? (function uD(e) {
              un.useDeprecatedSynchronousErrorHandling &&
                cn &&
                ((cn.errorThrown = !0), (cn.error = e));
            })(e)
          : Gu(e);
      }
      function as(e, t) {
        const { onStoppedNotification: n } = un;
        n && Do.setTimeout(() => n(e, t));
      }
      const hD = {
          closed: !0,
          next: zu,
          error: function fD(e) {
            throw e;
          },
          complete: zu,
        },
        ls =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Wu(e) {
        return e;
      }
      let Fe = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function gD(e) {
              return (
                (e && e instanceof is) ||
                ((function pD(e) {
                  return e && re(e.next) && re(e.error) && re(e.complete);
                })(e) &&
                  $u(e))
              );
            })(n)
              ? n
              : new mr(n, r, o);
            return (
              vo(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Zu(r))((o, i) => {
              const s = new mr({
                next: (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    i(l), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ls]() {
            return this;
          }
          pipe(...n) {
            return (function qu(e) {
              return 0 === e.length
                ? Wu
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = Zu(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Zu(e) {
        var t;
        return null !== (t = e ?? un.Promise) && void 0 !== t ? t : Promise;
      }
      const mD = mo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let us = (() => {
        class e extends Fe {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Yu(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new mD();
          }
          next(n) {
            vo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            vo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            vo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? Hu
              : ((this.currentObservers = null),
                i.push(n),
                new yt(() => {
                  (this.currentObservers = null), gr(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new Fe();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Yu(t, n)), e;
      })();
      class Yu extends us {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : Hu;
        }
      }
      function yr(e) {
        return (t) => {
          if (
            (function yD(e) {
              return re(e?.lift);
            })(t)
          )
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Dr(e, t, n, r, o) {
        return new DD(e, t, n, r, o);
      }
      class DD extends is {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    t.error(l);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (l) {
                    t.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function cs(e, t) {
        return yr((n, r) => {
          let o = 0;
          n.subscribe(
            Dr(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function dn(e) {
        return this instanceof dn ? ((this.v = e), this) : new dn(e);
      }
      function wD(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Xu(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function o(i, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    i({ value: u, done: a });
                  }, s);
                })(a, l, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      function Mn(e, t, n, r) {
        if ("a" === n && !r)
          throw new TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t ? e !== t || !r : !t.has(e))
          throw new TypeError(
            "Cannot read private member from an object whose class did not declare it"
          );
        return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
      }
      function Ju(e, t, n, r, o) {
        if ("m" === r) throw new TypeError("Private method is not writable");
        if ("a" === r && !o)
          throw new TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t ? e !== t || !o : !t.has(e))
          throw new TypeError(
            "Cannot write private member to an object whose class did not declare it"
          );
        return "a" === r ? o.call(e, n) : o ? (o.value = n) : t.set(e, n), n;
      }
      const ec = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function tc(e) {
        return re(e?.then);
      }
      function nc(e) {
        return re(e[ls]);
      }
      function rc(e) {
        return Symbol.asyncIterator && re(e?.[Symbol.asyncIterator]);
      }
      function oc(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const ic = (function bD() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function sc(e) {
        return re(e?.[ic]);
      }
      function ac(e) {
        return (function CD(e, t, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = n.apply(e, t || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof dn
                  ? Promise.resolve(f.value.v).then(u, c)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function u(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield dn(n.read());
              if (o) return yield dn(void 0);
              yield yield dn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function lc(e) {
        return re(e?.getReader);
      }
      function Yt(e) {
        if (e instanceof Fe) return e;
        if (null != e) {
          if (nc(e))
            return (function MD(e) {
              return new Fe((t) => {
                const n = e[ls]();
                if (re(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (ec(e))
            return (function ID(e) {
              return new Fe((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (tc(e))
            return (function SD(e) {
              return new Fe((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Gu);
              });
            })(e);
          if (rc(e)) return uc(e);
          if (sc(e))
            return (function AD(e) {
              return new Fe((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (lc(e))
            return (function TD(e) {
              return uc(ac(e));
            })(e);
        }
        throw oc(e);
      }
      function uc(e) {
        return new Fe((t) => {
          (function OD(e, t) {
            var n, r, o, i;
            return (function vD(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = wD(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function Qt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function cc(e, t, n = 1 / 0) {
        return re(t)
          ? cc((r, o) => cs((i, s) => t(r, i, o, s))(Yt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            yr((r, o) =>
              (function FD(e, t, n, r, o, i, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && t.complete();
                  },
                  h = (g) => (u < r ? p(g) : l.push(g)),
                  p = (g) => {
                    i && t.next(g), u++;
                    let D = !1;
                    Yt(n(g, c++)).subscribe(
                      Dr(
                        t,
                        (v) => {
                          o?.(v), i ? h(v) : t.next(v);
                        },
                        () => {
                          D = !0;
                        },
                        void 0,
                        () => {
                          if (D)
                            try {
                              for (u--; l.length && u < r; ) {
                                const v = l.shift();
                                s ? Qt(t, s, () => p(v)) : p(v);
                              }
                              f();
                            } catch (v) {
                              t.error(v);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Dr(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      const dc = new Fe((e) => e.complete());
      function fs(e) {
        return e[e.length - 1];
      }
      function fc(e, t = 0) {
        return yr((n, r) => {
          n.subscribe(
            Dr(
              r,
              (o) => Qt(r, e, () => r.next(o), t),
              () => Qt(r, e, () => r.complete(), t),
              (o) => Qt(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function hc(e, t = 0) {
        return yr((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function pc(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new Fe((n) => {
          Qt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Qt(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function gc(e, t) {
        return t
          ? (function UD(e, t) {
              if (null != e) {
                if (nc(e))
                  return (function VD(e, t) {
                    return Yt(e).pipe(hc(t), fc(t));
                  })(e, t);
                if (ec(e))
                  return (function jD(e, t) {
                    return new Fe((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (tc(e))
                  return (function BD(e, t) {
                    return Yt(e).pipe(hc(t), fc(t));
                  })(e, t);
                if (rc(e)) return pc(e, t);
                if (sc(e))
                  return (function HD(e, t) {
                    return new Fe((n) => {
                      let r;
                      return (
                        Qt(n, t, () => {
                          (r = e[ic]()),
                            Qt(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => re(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (lc(e))
                  return (function $D(e, t) {
                    return pc(ac(e), t);
                  })(e, t);
              }
              throw oc(e);
            })(e, t)
          : Yt(e);
      }
      function GD(...e) {
        const t = (function kD(e) {
            return (function xD(e) {
              return e && re(e.schedule);
            })(fs(e))
              ? e.pop()
              : void 0;
          })(e),
          n = (function LD(e, t) {
            return "number" == typeof fs(e) ? e.pop() : t;
          })(e, 1 / 0),
          r = e;
        return r.length
          ? 1 === r.length
            ? Yt(r[0])
            : (function ND(e = 1 / 0) {
                return cc(Wu, e);
              })(n)(gc(r, t))
          : dc;
      }
      function hs(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new mr({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return t(...n).subscribe(r);
      }
      function W(e) {
        for (let t in e) if (e[t] === W) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function ps(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function Z(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Z).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function gs(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const WD = W({ __forward_ref__: W });
      function Y(e) {
        return (
          (e.__forward_ref__ = Y),
          (e.toString = function () {
            return Z(this());
          }),
          e
        );
      }
      function I(e) {
        return ms(e) ? e() : e;
      }
      function ms(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(WD) &&
          e.__forward_ref__ === Y
        );
      }
      function ys(e) {
        return e && !!e.ɵproviders;
      }
      class C extends Error {
        constructor(t, n) {
          super(Co(t, n)), (this.code = t);
        }
      }
      function Co(e, t) {
        return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
      }
      function N(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function wo(e, t) {
        throw new C(-201, !1);
      }
      function Xe(e, t) {
        null == e &&
          (function U(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function K(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Dt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Eo(e) {
        return yc(e, bo) || yc(e, vc);
      }
      function yc(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Dc(e) {
        return e && (e.hasOwnProperty(Ds) || e.hasOwnProperty(ev))
          ? e[Ds]
          : null;
      }
      const bo = W({ ɵprov: W }),
        Ds = W({ ɵinj: W }),
        vc = W({ ngInjectableDef: W }),
        ev = W({ ngInjectorDef: W });
      var O = (() => (
        ((O = O || {})[(O.Default = 0)] = "Default"),
        (O[(O.Host = 1)] = "Host"),
        (O[(O.Self = 2)] = "Self"),
        (O[(O.SkipSelf = 4)] = "SkipSelf"),
        (O[(O.Optional = 8)] = "Optional"),
        O
      ))();
      let vs;
      function Je(e) {
        const t = vs;
        return (vs = e), t;
      }
      function _c(e, t, n) {
        const r = Eo(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & O.Optional
          ? null
          : void 0 !== t
          ? t
          : void wo(Z(e));
      }
      const X = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        vr = {},
        _s = "__NG_DI_FLAG__",
        Mo = "ngTempTokenPath",
        nv = "ngTokenPath",
        rv = /\n/gm,
        ov = "\u0275",
        Cc = "__source";
      let _r;
      function In(e) {
        const t = _r;
        return (_r = e), t;
      }
      function iv(e, t = O.Default) {
        if (void 0 === _r) throw new C(-203, !1);
        return null === _r
          ? _c(e, void 0, t)
          : _r.get(e, t & O.Optional ? null : void 0, t);
      }
      function j(e, t = O.Default) {
        return (
          (function tv() {
            return vs;
          })() || iv
        )(I(e), t);
      }
      function Cr(e, t = O.Default) {
        return j(e, Io(t));
      }
      function Io(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Cs(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = I(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = O.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = sv(a);
              "number" == typeof l
                ? -1 === l
                  ? (o = a.token)
                  : (i |= l)
                : (o = a);
            }
            t.push(j(o, i));
          } else t.push(j(r));
        }
        return t;
      }
      function wr(e, t) {
        return (e[_s] = t), (e.prototype[_s] = t), e;
      }
      function sv(e) {
        return e[_s];
      }
      function Xt(e) {
        return { toString: e }.toString();
      }
      var st = (() => (
          ((st = st || {})[(st.OnPush = 0)] = "OnPush"),
          (st[(st.Default = 1)] = "Default"),
          st
        ))(),
        vt = (() => {
          return (
            ((e = vt || (vt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            vt
          );
          var e;
        })();
      const Ft = {},
        H = [],
        So = W({ ɵcmp: W }),
        ws = W({ ɵdir: W }),
        Es = W({ ɵpipe: W }),
        Ec = W({ ɵmod: W }),
        Nt = W({ ɵfac: W }),
        Er = W({ __NG_ELEMENT_ID__: W });
      let uv = 0;
      function bs(e) {
        return Xt(() => {
          const n = !0 === e.standalone,
            r = {},
            o = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === st.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || H,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || vt.Emulated,
              id: "c" + uv++,
              styles: e.styles || H,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
              findHostDirectiveDefs: null,
              hostDirectives: null,
            },
            i = e.dependencies,
            s = e.features;
          return (
            (o.inputs = Ic(e.inputs, r)),
            (o.outputs = Ic(e.outputs)),
            s && s.forEach((a) => a(o)),
            (o.directiveDefs = i
              ? () => ("function" == typeof i ? i() : i).map(bc).filter(Mc)
              : null),
            (o.pipeDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Ne).filter(Mc)
              : null),
            o
          );
        });
      }
      function bc(e) {
        return G(e) || Ee(e);
      }
      function Mc(e) {
        return null !== e;
      }
      function Pt(e) {
        return Xt(() => ({
          type: e.type,
          bootstrap: e.bootstrap || H,
          declarations: e.declarations || H,
          imports: e.imports || H,
          exports: e.exports || H,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Ic(e, t) {
        if (null == e) return Ft;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const T = bs;
      function G(e) {
        return e[So] || null;
      }
      function Ee(e) {
        return e[ws] || null;
      }
      function Ne(e) {
        return e[Es] || null;
      }
      const xt = 0,
        E = 1,
        R = 2,
        ae = 3,
        at = 4,
        fn = 5,
        be = 6,
        Sn = 7,
        ue = 8,
        Ao = 9,
        To = 10,
        L = 11,
        Ms = 12,
        Mr = 13,
        Sc = 14,
        An = 15,
        Me = 16,
        Ir = 17,
        Tn = 18,
        _t = 19,
        Sr = 20,
        Ac = 21,
        J = 22,
        Is = 1,
        Tc = 2,
        Oo = 7,
        Fo = 8,
        On = 9,
        Pe = 10;
      function qe(e) {
        return Array.isArray(e) && "object" == typeof e[Is];
      }
      function lt(e) {
        return Array.isArray(e) && !0 === e[Is];
      }
      function Ss(e) {
        return 0 != (4 & e.flags);
      }
      function Ar(e) {
        return e.componentOffset > -1;
      }
      function No(e) {
        return 1 == (1 & e.flags);
      }
      function ut(e) {
        return null !== e.template;
      }
      function fv(e) {
        return 0 != (256 & e[R]);
      }
      function hn(e, t) {
        return e.hasOwnProperty(Nt) ? e[Nt] : null;
      }
      class gv {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Rt() {
        return Nc;
      }
      function Nc(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = yv), mv;
      }
      function mv() {
        const e = xc(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === Ft) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function yv(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            xc(e) ||
            (function Dv(e, t) {
              return (e[Pc] = t);
            })(e, { previous: Ft, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          l = a[o];
        (s[o] = new gv(l && l.currentValue, t, a === Ft)), (e[r] = t);
      }
      Rt.ngInherit = !0;
      const Pc = "__ngSimpleChanges__";
      function xc(e) {
        return e[Pc] || null;
      }
      const et = function (e, t, n) {};
      function Ce(e) {
        for (; Array.isArray(e); ) e = e[xt];
        return e;
      }
      function Po(e, t) {
        return Ce(t[e]);
      }
      function Ze(e, t) {
        return Ce(t[e.index]);
      }
      function Lc(e, t) {
        return e.data[t];
      }
      function Ye(e, t) {
        const n = t[e];
        return qe(n) ? n : n[xt];
      }
      function xo(e) {
        return 64 == (64 & e[R]);
      }
      function Jt(e, t) {
        return null == t ? null : e[t];
      }
      function Vc(e) {
        e[Tn] = 0;
      }
      function Ts(e, t) {
        e[fn] += t;
        let n = e,
          r = e[ae];
        for (
          ;
          null !== r && ((1 === t && 1 === n[fn]) || (-1 === t && 0 === n[fn]));

        )
          (r[fn] += t), (n = r), (r = r[ae]);
      }
      const P = { lFrame: Zc(null), bindingsEnabled: !0 };
      function jc() {
        return P.bindingsEnabled;
      }
      function y() {
        return P.lFrame.lView;
      }
      function B() {
        return P.lFrame.tView;
      }
      function Os(e) {
        return (P.lFrame.contextLView = e), e[ue];
      }
      function Fs(e) {
        return (P.lFrame.contextLView = null), e;
      }
      function we() {
        let e = Hc();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Hc() {
        return P.lFrame.currentTNode;
      }
      function Ct(e, t) {
        const n = P.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Ns() {
        return P.lFrame.isParent;
      }
      function Nn() {
        return P.lFrame.bindingIndex++;
      }
      function Fv(e, t) {
        const n = P.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), xs(t);
      }
      function xs(e) {
        P.lFrame.currentDirectiveIndex = e;
      }
      function zc() {
        return P.lFrame.currentQueryIndex;
      }
      function ks(e) {
        P.lFrame.currentQueryIndex = e;
      }
      function Pv(e) {
        const t = e[E];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[be] : null;
      }
      function Wc(e, t, n) {
        if (n & O.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & O.Host ||
              ((o = Pv(i)), null === o || ((i = i[An]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (P.lFrame = qc());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Ls(e) {
        const t = qc(),
          n = e[E];
        (P.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function qc() {
        const e = P.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Zc(e) : t;
      }
      function Zc(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function Yc() {
        const e = P.lFrame;
        return (
          (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Qc = Yc;
      function Vs() {
        const e = Yc();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Re() {
        return P.lFrame.selectedIndex;
      }
      function pn(e) {
        P.lFrame.selectedIndex = e;
      }
      function oe() {
        const e = P.lFrame;
        return Lc(e.tView, e.selectedIndex);
      }
      function Ro(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            l && (e.viewHooks || (e.viewHooks = [])).push(-n, l),
            u &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, u),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, u)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function ko(e, t, n) {
        Kc(e, t, 3, n);
      }
      function Lo(e, t, n, r) {
        (3 & e[R]) === n && Kc(e, t, n, r);
      }
      function Bs(e, t) {
        let n = e[R];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[R] = n));
      }
      function Kc(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[Tn] : 0; l < s; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (e[Tn] += 65536),
              (a < i || -1 == i) &&
                ($v(e, n, t, l), (e[Tn] = (4294901760 & e[Tn]) + l + 2)),
              l++;
      }
      function $v(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[R] >> 11 < e[Tn] >> 16 && (3 & e[R]) === t) {
            (e[R] += 2048), et(4, a, i);
            try {
              i.call(a);
            } finally {
              et(5, a, i);
            }
          }
        } else {
          et(4, a, i);
          try {
            i.call(a);
          } finally {
            et(5, a, i);
          }
        }
      }
      const Pn = -1;
      class Or {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Hs(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Jc(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function Xc(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Jc(e) {
        return 64 === e.charCodeAt(0);
      }
      function Fr(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  ed(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function ed(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function td(e) {
        return e !== Pn;
      }
      function Vo(e) {
        return 32767 & e;
      }
      function Bo(e, t) {
        let n = (function Wv(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[An]), n--;
        return r;
      }
      let $s = !0;
      function jo(e) {
        const t = $s;
        return ($s = e), t;
      }
      const nd = 255,
        rd = 5;
      let qv = 0;
      const wt = {};
      function Ho(e, t) {
        const n = od(e, t);
        if (-1 !== n) return n;
        const r = t[E];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Us(r.data, e),
          Us(t, null),
          Us(r.blueprint, null));
        const o = Gs(e, t),
          i = e.injectorIndex;
        if (td(o)) {
          const s = Vo(o),
            a = Bo(o, t),
            l = a[E].data;
          for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | l[s + u];
        }
        return (t[i + 8] = o), i;
      }
      function Us(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function od(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Gs(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = dd(o)), null === r)) return Pn;
          if ((n++, (o = o[An]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return Pn;
      }
      function zs(e, t, n) {
        !(function Zv(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Er) && (r = n[Er]),
            null == r && (r = n[Er] = qv++);
          const o = r & nd;
          t.data[e + (o >> rd)] |= 1 << o;
        })(e, t, n);
      }
      function id(e, t, n) {
        if (n & O.Optional || void 0 !== e) return e;
        wo();
      }
      function sd(e, t, n, r) {
        if (
          (n & O.Optional && void 0 === r && (r = null),
          !(n & (O.Self | O.Host)))
        ) {
          const o = e[Ao],
            i = Je(void 0);
          try {
            return o ? o.get(t, r, n & O.Optional) : _c(t, r, n & O.Optional);
          } finally {
            Je(i);
          }
        }
        return id(r, 0, n);
      }
      function ad(e, t, n, r = O.Default, o) {
        if (null !== e) {
          if (1024 & t[R]) {
            const s = (function Jv(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 1024 & s[R] && !(256 & s[R]);

              ) {
                const a = ld(i, s, n, r | O.Self, wt);
                if (a !== wt) return a;
                let l = i.parent;
                if (!l) {
                  const u = s[Ac];
                  if (u) {
                    const c = u.get(n, wt, r);
                    if (c !== wt) return c;
                  }
                  (l = dd(s)), (s = s[An]);
                }
                i = l;
              }
              return o;
            })(e, t, n, r, wt);
            if (s !== wt) return s;
          }
          const i = ld(e, t, n, r, wt);
          if (i !== wt) return i;
        }
        return sd(t, n, r, o);
      }
      function ld(e, t, n, r, o) {
        const i = (function Kv(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Er) ? e[Er] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & nd : Xv) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Wc(t, e, r)) return r & O.Host ? id(o, 0, r) : sd(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & O.Optional) return s;
            wo();
          } finally {
            Qc();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = od(e, t),
            l = Pn,
            u = r & O.Host ? t[Me][be] : null;
          for (
            (-1 === a || r & O.SkipSelf) &&
            ((l = -1 === a ? Gs(e, t) : t[a + 8]),
            l !== Pn && cd(r, !1)
              ? ((s = t[E]), (a = Vo(l)), (t = Bo(l, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[E];
            if (ud(i, a, c.data)) {
              const d = Qv(a, t, n, s, r, u);
              if (d !== wt) return d;
            }
            (l = t[a + 8]),
              l !== Pn && cd(r, t[E].data[a + 8] === u) && ud(i, a, t)
                ? ((s = c), (a = Vo(l)), (t = Bo(l, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function Qv(e, t, n, r, o, i) {
        const s = t[E],
          a = s.data[e + 8],
          c = $o(
            a,
            s,
            n,
            null == r ? Ar(a) && $s : r != s && 0 != (3 & a.type),
            o & O.Host && i === a
          );
        return null !== c ? gn(t, s, c, a) : wt;
      }
      function $o(e, t, n, r, o) {
        const i = e.providerIndexes,
          s = t.data,
          a = 1048575 & i,
          l = e.directiveStart,
          c = i >> 20,
          f = o ? a + c : e.directiveEnd;
        for (let h = r ? a : a + c; h < f; h++) {
          const p = s[h];
          if ((h < l && n === p) || (h >= l && p.type === n)) return h;
        }
        if (o) {
          const h = s[l];
          if (h && ut(h) && h.type === n) return l;
        }
        return null;
      }
      function gn(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function Uv(e) {
            return e instanceof Or;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function qD(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function $(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : N(e);
              })(i[n])
            );
          const a = jo(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Je(s.injectImpl) : null;
          Wc(e, r, O.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function Hv(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Nc(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== l && Je(l), jo(a), (s.resolving = !1), Qc();
          }
        }
        return o;
      }
      function ud(e, t, n) {
        return !!(n[t + (e >> rd)] & (1 << e));
      }
      function cd(e, t) {
        return !(e & O.Self || (e & O.Host && t));
      }
      class xn {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return ad(this._tNode, this._lView, t, Io(r), n);
        }
      }
      function Xv() {
        return new xn(we(), y());
      }
      function Ws(e) {
        return ms(e)
          ? () => {
              const t = Ws(I(e));
              return t && t();
            }
          : hn(e);
      }
      function dd(e) {
        const t = e[E],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[be] : null;
      }
      const kn = "__parameters__";
      function Vn(e, t, n) {
        return Xt(() => {
          const r = (function Zs(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(kn)
                ? l[kn]
                : Object.defineProperty(l, kn, { value: [] })[kn];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class F {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = K({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function mn(e, t) {
        e.forEach((n) => (Array.isArray(n) ? mn(n, t) : t(n)));
      }
      function hd(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Uo(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function Qe(e, t, n) {
        let r = Bn(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function r_(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Qs(e, t) {
        const n = Bn(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Bn(e, t) {
        return (function pd(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const zo = wr(Vn("Optional"), 8),
        Wo = wr(Vn("SkipSelf"), 4);
      var je = (() => (
        ((je = je || {})[(je.Important = 1)] = "Important"),
        (je[(je.DashCase = 2)] = "DashCase"),
        je
      ))();
      const na = new Map();
      let M_ = 0;
      const oa = "__ngContext__";
      function Se(e, t) {
        qe(t)
          ? ((e[oa] = t[Sr]),
            (function S_(e) {
              na.set(e[Sr], e);
            })(t))
          : (e[oa] = t);
      }
      let ia;
      function sa(e, t) {
        return ia(e, t);
      }
      function Vr(e) {
        const t = e[ae];
        return lt(t) ? t[ae] : t;
      }
      function aa(e) {
        return xd(e[Mr]);
      }
      function la(e) {
        return xd(e[at]);
      }
      function xd(e) {
        for (; null !== e && !lt(e); ) e = e[at];
        return e;
      }
      function Hn(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          lt(r) ? (i = r) : qe(r) && ((s = !0), (r = r[xt]));
          const a = Ce(r);
          0 === e && null !== n
            ? null == o
              ? jd(t, n, a)
              : yn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? yn(t, n, a, o || null, !0)
            : 2 === e
            ? (function ga(e, t, n) {
                const r = Yo(e, t);
                r &&
                  (function q_(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function Q_(e, t, n, r, o) {
                const i = n[Oo];
                i !== Ce(n) && Hn(t, e, r, i, o);
                for (let a = Pe; a < n.length; a++) {
                  const l = n[a];
                  Br(l[E], l, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function ca(e, t, n) {
        return e.createElement(t, n);
      }
      function kd(e, t) {
        const n = e[On],
          r = n.indexOf(t),
          o = t[ae];
        512 & t[R] && ((t[R] &= -513), Ts(o, -1)), n.splice(r, 1);
      }
      function da(e, t) {
        if (e.length <= Pe) return;
        const n = Pe + t,
          r = e[n];
        if (r) {
          const o = r[Ir];
          null !== o && o !== e && kd(o, r), t > 0 && (e[n - 1][at] = r[at]);
          const i = Uo(e, Pe + t);
          !(function B_(e, t) {
            Br(e, t, t[L], 2, null, null), (t[xt] = null), (t[be] = null);
          })(r[E], r);
          const s = i[_t];
          null !== s && s.detachView(i[E]),
            (r[ae] = null),
            (r[at] = null),
            (r[R] &= -65);
        }
        return r;
      }
      function Ld(e, t) {
        if (!(128 & t[R])) {
          const n = t[L];
          n.destroyNode && Br(e, t, n, 3, null, null),
            (function $_(e) {
              let t = e[Mr];
              if (!t) return fa(e[E], e);
              for (; t; ) {
                let n = null;
                if (qe(t)) n = t[Mr];
                else {
                  const r = t[Pe];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[at] && t !== e; )
                    qe(t) && fa(t[E], t), (t = t[ae]);
                  null === t && (t = e), qe(t) && fa(t[E], t), (n = t && t[at]);
                }
                t = n;
              }
            })(t);
        }
      }
      function fa(e, t) {
        if (!(128 & t[R])) {
          (t[R] &= -65),
            (t[R] |= 128),
            (function W_(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof Or)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          l = i[s + 1];
                        et(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          et(5, a, l);
                        }
                      }
                    else {
                      et(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        et(5, o, i);
                      }
                    }
                  }
                }
            })(e, t),
            (function z_(e, t) {
              const n = e.cleanup,
                r = t[Sn];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[(o = s)]() : r[(o = -s)].unsubscribe(), (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[Sn] = null;
              }
            })(e, t),
            1 === t[E].type && t[L].destroy();
          const n = t[Ir];
          if (null !== n && lt(t[ae])) {
            n !== t[ae] && kd(n, t);
            const r = t[_t];
            null !== r && r.detachView(e);
          }
          !(function A_(e) {
            na.delete(e[Sr]);
          })(t);
        }
      }
      function Vd(e, t, n) {
        return (function Bd(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[xt];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === vt.None || i === vt.Emulated) return null;
            }
            return Ze(r, n);
          }
        })(e, t.parent, n);
      }
      function yn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function jd(e, t, n) {
        e.appendChild(t, n);
      }
      function Hd(e, t, n, r, o) {
        null !== r ? yn(e, t, n, r, o) : jd(e, t, n);
      }
      function Yo(e, t) {
        return e.parentNode(t);
      }
      let ha,
        Da,
        Gd = function Ud(e, t, n) {
          return 40 & e.type ? Ze(e, n) : null;
        };
      function Qo(e, t, n, r) {
        const o = Vd(e, r, t),
          i = t[L],
          a = (function $d(e, t, n) {
            return Gd(e, t, n);
          })(r.parent || t[be], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) Hd(i, o, n[l], a, !1);
          else Hd(i, o, n, a, !1);
        void 0 !== ha && ha(i, r, t, n, o);
      }
      function Ko(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return Ze(t, e);
          if (4 & n) return pa(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return Ko(e, r);
            {
              const o = e[t.index];
              return lt(o) ? pa(-1, o) : Ce(o);
            }
          }
          if (32 & n) return sa(t, e)() || Ce(e[t.index]);
          {
            const r = Wd(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Ko(Vr(e[Me]), r)
              : Ko(e, t.next);
          }
        }
        return null;
      }
      function Wd(e, t) {
        return null !== t ? e[Me][be].projection[t.projection] : null;
      }
      function pa(e, t) {
        const n = Pe + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[E].firstChild;
          if (null !== o) return Ko(r, o);
        }
        return t[Oo];
      }
      function ma(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === t && (a && Se(Ce(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & l) ma(e, t, n.child, r, o, i, !1), Hn(t, e, o, a, i);
            else if (32 & l) {
              const u = sa(n, r);
              let c;
              for (; (c = u()); ) Hn(t, e, o, c, i);
              Hn(t, e, o, a, i);
            } else 16 & l ? qd(e, t, r, n, o, i) : Hn(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Br(e, t, n, r, o, i) {
        ma(n, r, e.firstChild, t, o, i, !1);
      }
      function qd(e, t, n, r, o, i) {
        const s = n[Me],
          l = s[be].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Hn(t, e, o, l[u], i);
        else ma(e, t, l, s[ae], o, i, !0);
      }
      function Zd(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Yd(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && Hs(e, t, r),
          null !== o && Zd(e, t, o),
          null !== i &&
            (function X_(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class ef {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      const cf = new F("ENVIRONMENT_INITIALIZER"),
        df = new F("INJECTOR", -1),
        ff = new F("INJECTOR_DEF_TYPES");
      class hf {
        get(t, n = vr) {
          if (n === vr) {
            const r = new Error(`NullInjectorError: No provider for ${Z(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function IC(...e) {
        return { ɵproviders: pf(0, e), ɵfromNgModule: !0 };
      }
      function pf(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          mn(t, (i) => {
            const s = i;
            ba(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && gf(o, n),
          n
        );
      }
      function gf(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          Ma(o, (i) => {
            t.push(i);
          });
        }
      }
      function ba(e, t, n, r) {
        if (!(e = I(e))) return !1;
        let o = null,
          i = Dc(e);
        const s = !i && G(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const l = e.ngModule;
          if (((i = Dc(l)), !i)) return !1;
          o = l;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const u of l) ba(u, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let u;
              r.add(o);
              try {
                mn(i.imports, (c) => {
                  ba(c, t, n, r) && (u || (u = []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && gf(u, t);
            }
            if (!a) {
              const u = hn(o) || (() => new o());
              t.push(
                { provide: o, useFactory: u, deps: H },
                { provide: ff, useValue: o, multi: !0 },
                { provide: cf, useValue: () => j(o), multi: !0 }
              );
            }
            const l = i.providers;
            null == l ||
              a ||
              Ma(l, (c) => {
                t.push(c);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Ma(e, t) {
        for (let n of e)
          ys(n) && (n = n.ɵproviders), Array.isArray(n) ? Ma(n, t) : t(n);
      }
      const SC = W({ provide: String, useValue: W });
      function Ia(e) {
        return null !== e && "object" == typeof e && SC in e;
      }
      function Dn(e) {
        return "function" == typeof e;
      }
      const Sa = new F("Set Injector scope."),
        ti = {},
        TC = {};
      let Aa;
      function ni() {
        return void 0 === Aa && (Aa = new hf()), Aa;
      }
      class Un {}
      class Df extends Un {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Oa(t, (s) => this.processProvider(s)),
            this.records.set(df, Gn(void 0, this)),
            o.has("environment") && this.records.set(Un, Gn(void 0, this));
          const i = this.records.get(Sa);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(ff.multi, H, O.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = In(this),
            r = Je(void 0);
          try {
            return t();
          } finally {
            In(n), Je(r);
          }
        }
        get(t, n = vr, r = O.Default) {
          this.assertNotDestroyed(), (r = Io(r));
          const o = In(this),
            i = Je(void 0);
          try {
            if (!(r & O.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  (function xC(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof F)
                    );
                  })(t) && Eo(t);
                (a = l && this.injectableDefInScope(l) ? Gn(Ta(t), ti) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & O.Self ? ni() : this.parent).get(
              t,
              (n = r & O.Optional && n === vr ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Mo] = s[Mo] || []).unshift(Z(t)), o)) throw s;
              return (function av(e, t, n, r) {
                const o = e[Mo];
                throw (
                  (t[Cc] && o.unshift(t[Cc]),
                  (e.message = (function lv(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && e.charAt(1) == ov
                        ? e.slice(2)
                        : e;
                    let o = Z(t);
                    if (Array.isArray(t)) o = t.map(Z).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Z(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      rv,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e[nv] = o),
                  (e[Mo] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Je(i), In(o);
          }
        }
        resolveInjectorInitializers() {
          const t = In(this),
            n = Je(void 0);
          try {
            const r = this.get(cf.multi, H, O.Self);
            for (const o of r) o();
          } finally {
            In(t), Je(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(Z(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let n = Dn((t = I(t))) ? t : I(t && t.provide);
          const r = (function FC(e) {
            return Ia(e) ? Gn(void 0, e.useValue) : Gn(vf(e), ti);
          })(t);
          if (Dn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Gn(void 0, ti, !0)),
              (o.factory = () => Cs(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === ti && ((n.value = TC), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function PC(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = I(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function Ta(e) {
        const t = Eo(e),
          n = null !== t ? t.factory : hn(e);
        if (null !== n) return n;
        if (e instanceof F) throw new C(204, !1);
        if (e instanceof Function)
          return (function OC(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function xr(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function XD(e) {
              const t = e && (e[bo] || e[vc]);
              return t
                ? ((function JD(e) {
                    if (e.hasOwnProperty("name")) return e.name;
                    ("" + e).match(/^function\s*([^\s(]+)/);
                  })(e),
                  t)
                : null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function vf(e, t, n) {
        let r;
        if (Dn(e)) {
          const o = I(e);
          return hn(o) || Ta(o);
        }
        if (Ia(e)) r = () => I(e.useValue);
        else if (
          (function yf(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...Cs(e.deps || []));
        else if (
          (function mf(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => j(I(e.useExisting));
        else {
          const o = I(e && (e.useClass || e.provide));
          if (
            !(function NC(e) {
              return !!e.deps;
            })(e)
          )
            return hn(o) || Ta(o);
          r = () => new o(...Cs(e.deps));
        }
        return r;
      }
      function Gn(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Oa(e, t) {
        for (const n of e)
          Array.isArray(n) ? Oa(n, t) : n && ys(n) ? Oa(n.ɵproviders, t) : t(n);
      }
      class RC {}
      class _f {}
      class LC {
        resolveComponentFactory(t) {
          throw (function kC(e) {
            const t = Error(
              `No component factory found for ${Z(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let ri = (() => {
        class e {}
        return (e.NULL = new LC()), e;
      })();
      function VC() {
        return zn(we(), y());
      }
      function zn(e, t) {
        return new $e(Ze(e, t));
      }
      let $e = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = VC), e;
      })();
      function BC(e) {
        return e instanceof $e ? e.nativeElement : e;
      }
      class wf {}
      let Bt = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function jC() {
                const e = y(),
                  n = Ye(we().index, e);
                return (qe(n) ? n : e)[L];
              })()),
            e
          );
        })(),
        HC = (() => {
          class e {}
          return (
            (e.ɵprov = K({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class oi {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const $C = new oi("15.2.1"),
        Fa = {},
        Na = "ngOriginalError";
      function Pa(e) {
        return e[Na];
      }
      class Wn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Pa(t);
          for (; n && Pa(n); ) n = Pa(n);
          return n || null;
        }
      }
      function bf(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Mf = "ng-template";
      function JC(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== bf(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function If(e) {
        return 4 === e.type && e.value !== Mf;
      }
      function ew(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Mf);
      }
      function tw(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function ow(e) {
            for (let t = 0; t < e.length; t++) if (Xc(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !ew(e, l, n)) || ("" === l && 1 === t.length))
                ) {
                  if (ct(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!JC(e.attrs, u, n)) {
                    if (ct(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = nw(8 & r ? "class" : l, o, If(e), n);
                if (-1 === d) {
                  if (ct(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== bf(h, u, 0)) || (2 & r && u !== f)) {
                    if (ct(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !ct(r) && !ct(l)) return !1;
            if (s && ct(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return ct(r) || s;
      }
      function ct(e) {
        return 0 == (1 & e);
      }
      function nw(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function iw(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function Sf(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (tw(e, t[r], n)) return !0;
        return !1;
      }
      function Af(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function aw(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !ct(s) && ((t += Af(i, o)), (o = "")),
              (r = s),
              (i = i || !ct(r));
          n++;
        }
        return "" !== o && (t += Af(i, o)), t;
      }
      const x = {};
      function Ue(e) {
        Tf(B(), y(), Re() + e, !1);
      }
      function Tf(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[R])) {
            const i = e.preOrderCheckHooks;
            null !== i && ko(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Lo(t, i, 0, n);
          }
        pn(n);
      }
      function Pf(e, t = null, n = null, r) {
        const o = xf(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function xf(e, t = null, n = null, r, o = new Set()) {
        const i = [n || H, IC(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : Z(e))),
          new Df(i, t || ni(), r || null, o)
        );
      }
      let tn = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return Pf({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Pf({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = vr),
          (e.NULL = new hf()),
          (e.ɵprov = K({ token: e, providedIn: "any", factory: () => j(df) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function _(e, t = O.Default) {
        const n = y();
        return null === n ? j(e, t) : ad(we(), n, I(e), t);
      }
      function Hf(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              ks(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function si(e, t, n, r, o, i, s, a, l, u, c) {
        const d = t.blueprint.slice();
        return (
          (d[xt] = o),
          (d[R] = 76 | r),
          (null !== c || (e && 1024 & e[R])) && (d[R] |= 1024),
          Vc(d),
          (d[ae] = d[An] = e),
          (d[ue] = n),
          (d[To] = s || (e && e[To])),
          (d[L] = a || (e && e[L])),
          (d[Ms] = l || (e && e[Ms]) || null),
          (d[Ao] = u || (e && e[Ao]) || null),
          (d[be] = i),
          (d[Sr] = (function I_() {
            return M_++;
          })()),
          (d[Ac] = c),
          (d[Me] = 2 == t.type ? e[Me] : d),
          d
        );
      }
      function Yn(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function Va(e, t, n, r, o) {
            const i = Hc(),
              s = Ns(),
              l = (e.data[t] = (function xw(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  componentOffset: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  prev: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== i &&
                (s
                  ? null == i.child && null !== l.parent && (i.child = l)
                  : null === i.next && ((i.next = l), (l.prev = i))),
              l
            );
          })(e, t, n, r, o)),
            (function Ov() {
              return P.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Tr() {
            const e = P.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Ct(i, !0), i;
      }
      function Ur(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Ba(e, t, n) {
        Ls(t);
        try {
          const r = e.viewQuery;
          null !== r && Ya(1, r, n);
          const o = e.template;
          null !== o && $f(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Hf(e, t),
            e.staticViewQueries && Ya(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function Fw(e, t) {
              for (let n = 0; n < t.length; n++) Jw(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[R] &= -5), Vs();
        }
      }
      function ai(e, t, n, r) {
        const o = t[R];
        if (128 != (128 & o)) {
          Ls(t);
          try {
            Vc(t),
              (function Uc(e) {
                return (P.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && $f(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const u = e.preOrderCheckHooks;
              null !== u && ko(t, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && Lo(t, u, 0, null), Bs(t, 0);
            }
            if (
              ((function Kw(e) {
                for (let t = aa(e); null !== t; t = la(t)) {
                  if (!t[Tc]) continue;
                  const n = t[On];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    512 & o[R] || Ts(o[ae], 1), (o[R] |= 512);
                  }
                }
              })(t),
              (function Qw(e) {
                for (let t = aa(e); null !== t; t = la(t))
                  for (let n = Pe; n < t.length; n++) {
                    const r = t[n],
                      o = r[E];
                    xo(r) && ai(o, r, o.template, r[ue]);
                  }
              })(t),
              null !== e.contentQueries && Hf(e, t),
              s)
            ) {
              const u = e.contentCheckHooks;
              null !== u && ko(t, u);
            } else {
              const u = e.contentHooks;
              null !== u && Lo(t, u, 1), Bs(t, 1);
            }
            !(function Tw(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) pn(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      Fv(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  pn(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function Ow(e, t) {
                for (let n = 0; n < t.length; n++) Xw(e, t[n]);
              })(t, a);
            const l = e.viewQuery;
            if ((null !== l && Ya(2, l, r), s)) {
              const u = e.viewCheckHooks;
              null !== u && ko(t, u);
            } else {
              const u = e.viewHooks;
              null !== u && Lo(t, u, 2), Bs(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[R] &= -41),
              512 & t[R] && ((t[R] &= -513), Ts(t[ae], -1));
          } finally {
            Vs();
          }
        }
      }
      function $f(e, t, n, r, o) {
        const i = Re(),
          s = 2 & r;
        try {
          pn(-1),
            s && t.length > J && Tf(e, t, J, !1),
            et(s ? 2 : 0, o),
            n(r, o);
        } finally {
          pn(i), et(s ? 3 : 1, o);
        }
      }
      function ja(e, t, n) {
        if (Ss(t)) {
          const o = t.directiveEnd;
          for (let i = t.directiveStart; i < o; i++) {
            const s = e.data[i];
            s.contentQueries && s.contentQueries(1, n[i], i);
          }
        }
      }
      function Ha(e, t, n) {
        jc() &&
          ((function jw(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            Ar(n) &&
              (function qw(e, t, n) {
                const r = Ze(t, e),
                  o = Uf(n),
                  i = e[To],
                  s = li(
                    e,
                    si(
                      e,
                      o,
                      null,
                      n.onPush ? 32 : 16,
                      r,
                      t,
                      i,
                      i.createRenderer(r, n),
                      null,
                      null,
                      null
                    )
                  );
                e[t.index] = s;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || Ho(n, t),
              Se(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const l = e.data[a],
                u = gn(t, e, a, n);
              Se(u, t),
                null !== s && Zw(0, a - o, u, l, 0, s),
                ut(l) && (Ye(n.index, t)[ue] = gn(t, e, a, n));
            }
          })(e, t, n, Ze(n, t)),
          64 == (64 & n.flags) && Yf(e, t, n));
      }
      function $a(e, t, n = Ze) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Uf(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Ua(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function Ua(e, t, n, r, o, i, s, a, l, u) {
        const c = J + r,
          d = c + o,
          f = (function Nw(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : x);
            return n;
          })(c, d),
          h = "function" == typeof u ? u() : u;
        return (f[E] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Gf(e, t, n, r) {
        const o = Kf(t);
        null === n
          ? o.push(r)
          : (o.push(n), e.firstCreatePass && Xf(e).push(r, o.length - 1));
      }
      function zf(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? Wf(n, t, o, i)
              : r.hasOwnProperty(o) && Wf(n, t, r[o], i);
          }
        return n;
      }
      function Wf(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function qf(e, t) {
        const n = Ye(t, e);
        16 & n[R] || (n[R] |= 32);
      }
      function Ga(e, t, n, r) {
        if (jc()) {
          const o = null === r ? null : { "": -1 },
            i = (function $w(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if (Sf(t, s.selectors, !1))
                    if ((r || (r = []), ut(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          za(e, t, a.length);
                      } else r.unshift(s), za(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Zf(e, t, n, s, o, a),
            o &&
              (function Uw(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < t.length; o += 2) {
                    const i = n[t[o + 1]];
                    if (null == i) throw new C(-301, !1);
                    r.push(t[o], i);
                  }
                }
              })(n, r, o);
        }
        n.mergedAttrs = Fr(n.mergedAttrs, n.attrs);
      }
      function Zf(e, t, n, r, o, i) {
        for (let u = 0; u < r.length; u++) zs(Ho(n, t), e, r[u].type);
        !(function zw(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          l = Ur(e, t, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          (n.mergedAttrs = Fr(n.mergedAttrs, c.hostAttrs)),
            Ww(e, n, t, l, c),
            Gw(l, c, o),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                n.index
              ),
              (a = !0)),
            l++;
        }
        !(function Rw(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = t.directiveStart; c < o; c++) {
            const d = i[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (l = zf(d.inputs, c, l, f ? f.inputs : null)),
              (u = zf(d.outputs, c, u, p));
            const g = null === l || null === s || If(t) ? null : Yw(l, c, s);
            a.push(g);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (t.flags |= 8),
            l.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = l),
            (t.outputs = u);
        })(e, n, i);
      }
      function Yf(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function Nv() {
            return P.lFrame.currentDirectiveIndex;
          })();
        try {
          pn(i);
          for (let a = r; a < o; a++) {
            const l = e.data[a],
              u = t[a];
            xs(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                Hw(l, u);
          }
        } finally {
          pn(-1), xs(s);
        }
      }
      function Hw(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function za(e, t, n) {
        (t.componentOffset = n),
          (e.components || (e.components = [])).push(t.index);
      }
      function Gw(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          ut(t) && (n[""] = e);
        }
      }
      function Ww(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = hn(o.type)),
          s = new Or(i, ut(o), _);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function Vw(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function Bw(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, Ur(e, n, o.hostVars, x), o);
      }
      function Et(e, t, n, r, o, i) {
        const s = Ze(e, t);
        !(function Wa(e, t, n, r, o, i, s) {
          if (null == i) e.removeAttribute(t, o, n);
          else {
            const a = null == s ? N(i) : s(i, r || "", o);
            e.setAttribute(t, o, a, n);
          }
        })(t[L], s, i, e.value, n, r, o);
      }
      function Zw(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? r.setInput(n, d, u, c) : (n[c] = d);
          }
        }
      }
      function Yw(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function Qf(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null];
      }
      function Xw(e, t) {
        const n = Ye(t, e);
        if (xo(n)) {
          const r = n[E];
          48 & n[R] ? ai(r, n, r.template, n[ue]) : n[fn] > 0 && qa(n);
        }
      }
      function qa(e) {
        for (let r = aa(e); null !== r; r = la(r))
          for (let o = Pe; o < r.length; o++) {
            const i = r[o];
            if (xo(i))
              if (512 & i[R]) {
                const s = i[E];
                ai(s, i, s.template, i[ue]);
              } else i[fn] > 0 && qa(i);
          }
        const n = e[E].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = Ye(n[r], e);
            xo(o) && o[fn] > 0 && qa(o);
          }
      }
      function Jw(e, t) {
        const n = Ye(t, e),
          r = n[E];
        (function eE(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          Ba(r, n, n[ue]);
      }
      function li(e, t) {
        return e[Mr] ? (e[Sc][at] = t) : (e[Mr] = t), (e[Sc] = t), t;
      }
      function Za(e) {
        for (; e; ) {
          e[R] |= 32;
          const t = Vr(e);
          if (fv(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function ui(e, t, n, r = !0) {
        const o = t[To];
        o.begin && o.begin();
        try {
          ai(e, t, e.template, n);
        } catch (s) {
          throw (r && eh(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function Ya(e, t, n) {
        ks(0), t(e, n);
      }
      function Kf(e) {
        return e[Sn] || (e[Sn] = []);
      }
      function Xf(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function eh(e, t) {
        const n = e[Ao],
          r = n ? n.get(Wn, null) : null;
        r && r.handleError(t);
      }
      function Qa(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            l = t[s],
            u = e.data[s];
          null !== u.setInput ? u.setInput(l, o, r, a) : (l[a] = o);
        }
      }
      function ci(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = gs(o, a))
              : 2 == i && (r = gs(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function di(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(Ce(i)), lt(i)))
            for (let a = Pe; a < i.length; a++) {
              const l = i[a],
                u = l[E].firstChild;
              null !== u && di(l[E], l, u, r);
            }
          const s = n.type;
          if (8 & s) di(e, t, n.child, r);
          else if (32 & s) {
            const a = sa(n, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Wd(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Vr(t[Me]);
              di(l[E], l, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Gr {
        get rootNodes() {
          const t = this._lView,
            n = t[E];
          return di(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ue];
        }
        set context(t) {
          this._lView[ue] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[R]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[ae];
            if (lt(t)) {
              const n = t[Fo],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (da(t, r), Uo(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Ld(this._lView[E], this._lView);
        }
        onDestroy(t) {
          Gf(this._lView[E], this._lView, null, t);
        }
        markForCheck() {
          Za(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[R] &= -65;
        }
        reattach() {
          this._lView[R] |= 64;
        }
        detectChanges() {
          ui(this._lView[E], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function H_(e, t) {
              Br(e, t, t[L], 2, null, null);
            })(this._lView[E], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class tE extends Gr {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          ui(t[E], t, t[ue], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class th extends ri {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = G(t);
          return new zr(n, this.ngModule);
        }
      }
      function nh(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class rE {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = Io(r);
          const o = this.injector.get(t, Fa, r);
          return o !== Fa || n === Fa ? o : this.parentInjector.get(t, n, r);
        }
      }
      class zr extends _f {
        get inputs() {
          return nh(this.componentDef.inputs);
        }
        get outputs() {
          return nh(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function lw(e) {
              return e.map(aw).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof Un ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new rE(t, i) : t,
            a = s.get(wf, null);
          if (null === a) throw new C(407, !1);
          const l = s.get(HC, null),
            u = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function Pw(e, t, n) {
                  return e.selectRootElement(t, n === vt.ShadowDom);
                })(u, r, this.componentDef.encapsulation)
              : ca(
                  u,
                  c,
                  (function nE(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = Ua(0, null, null, 1, 0, null, null, null, null, null),
            p = si(null, h, null, f, null, null, a, u, l, s, null);
          let g, D;
          Ls(p);
          try {
            const v = this.componentDef;
            let b,
              m = null;
            v.findHostDirectiveDefs
              ? ((b = []),
                (m = new Map()),
                v.findHostDirectiveDefs(v, b, m),
                b.push(v))
              : (b = [v]);
            const A = (function iE(e, t) {
                const n = e[E],
                  r = J;
                return (e[r] = t), Yn(n, r, 2, "#host", null);
              })(p, d),
              q = (function sE(e, t, n, r, o, i, s, a) {
                const l = o[E];
                !(function aE(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = Fr(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (ci(t, t.mergedAttrs, !0), null !== n && Yd(r, n, t));
                })(r, e, t, s);
                const u = i.createRenderer(t, n),
                  c = si(
                    o,
                    Uf(n),
                    null,
                    n.onPush ? 32 : 16,
                    o[e.index],
                    e,
                    i,
                    u,
                    a || null,
                    null,
                    null
                  );
                return (
                  l.firstCreatePass && za(l, e, r.length - 1),
                  li(o, c),
                  (o[e.index] = c)
                );
              })(A, d, v, b, p, a, u);
            (D = Lc(h, J)),
              d &&
                (function uE(e, t, n, r) {
                  if (r) Hs(e, n, ["ng-version", $C.full]);
                  else {
                    const { attrs: o, classes: i } = (function uw(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!ct(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && Hs(e, n, o),
                      i && i.length > 0 && Zd(e, n, i.join(" "));
                  }
                })(u, v, d, r),
              void 0 !== n &&
                (function cE(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(D, this.ngContentSelectors, n),
              (g = (function lE(e, t, n, r, o, i) {
                const s = we(),
                  a = o[E],
                  l = Ze(s, o);
                Zf(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  Se(gn(o, a, s.directiveStart + c, s), o);
                Yf(a, o, s), l && Se(l, o);
                const u = gn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ue] = o[ue] = u), null !== i))
                  for (const c of i) c(u, t);
                return ja(a, s, e), u;
              })(q, v, b, m, p, [dE])),
              Ba(h, p, null);
          } finally {
            Vs();
          }
          return new oE(this.componentType, g, zn(D, p), p, D);
        }
      }
      class oE extends RC {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new tE(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            Qa(i[E], i, o, t, n), qf(i, this._tNode.index);
          }
        }
        get injector() {
          return new xn(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function dE() {
        const e = we();
        Ro(y()[E], e);
      }
      function z(e) {
        let t = (function rh(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let o;
          if (ut(e)) o = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            o = t.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = e;
              (s.inputs = Ka(e.inputs)),
                (s.declaredInputs = Ka(e.declaredInputs)),
                (s.outputs = Ka(e.outputs));
              const a = o.hostBindings;
              a && gE(e, a);
              const l = o.viewQuery,
                u = o.contentQueries;
              if (
                (l && hE(e, l),
                u && pE(e, u),
                ps(e.inputs, o.inputs),
                ps(e.declaredInputs, o.declaredInputs),
                ps(e.outputs, o.outputs),
                ut(o) && o.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === z && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function fE(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Fr(o.hostAttrs, (n = Fr(n, o.hostAttrs))));
          }
        })(r);
      }
      function Ka(e) {
        return e === Ft ? {} : e === H ? [] : e;
      }
      function hE(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function pE(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function gE(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function fi(e) {
        return (
          !!Xa(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Xa(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function Ae(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Mt(e, t, n, r) {
        const o = y();
        return Ae(o, Nn(), t) && (B(), Et(oe(), o, e, t, n, r)), Mt;
      }
      function qr(e, t, n, r, o, i, s, a) {
        const l = y(),
          u = B(),
          c = e + J,
          d = u.firstCreatePass
            ? (function ME(e, t, n, r, o, i, s, a, l) {
                const u = t.consts,
                  c = Yn(t, e, 4, s || null, Jt(u, a));
                Ga(t, n, c, Jt(u, l)), Ro(t, c);
                const d = (c.tViews = Ua(
                  2,
                  c,
                  r,
                  o,
                  i,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  u
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, t, n, r, o, i, s)
            : u.data[c];
        Ct(d, !1);
        const f = l[L].createComment("");
        Qo(u, l, f, d),
          Se(f, l),
          li(l, (l[c] = Qf(f, l, f, d))),
          No(d) && Ha(u, l, d),
          null != s && $a(l, d, a);
      }
      function $t(e, t, n) {
        const r = y();
        return (
          Ae(r, Nn(), t) &&
            (function Ke(e, t, n, r, o, i, s, a) {
              const l = Ze(t, n);
              let c,
                u = t.inputs;
              !a && null != u && (c = u[r])
                ? (Qa(e, n, c, r, o), Ar(t) && qf(n, t.index))
                : 3 & t.type &&
                  ((r = (function kw(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  i.setProperty(l, r, o));
            })(B(), oe(), r, e, t, r[L], n, !1),
          $t
        );
      }
      function Ja(e, t, n, r, o) {
        const s = o ? "class" : "style";
        Qa(e, n, t.inputs[s], s, r);
      }
      function ie(e, t, n, r) {
        const o = y(),
          i = B(),
          s = J + e,
          a = o[L],
          l = i.firstCreatePass
            ? (function AE(e, t, n, r, o, i) {
                const s = t.consts,
                  l = Yn(t, e, 2, r, Jt(s, o));
                return (
                  Ga(t, n, l, Jt(s, i)),
                  null !== l.attrs && ci(l, l.attrs, !1),
                  null !== l.mergedAttrs && ci(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, i, o, t, n, r)
            : i.data[s],
          u = (o[s] = ca(
            a,
            t,
            (function jv() {
              return P.lFrame.currentNamespace;
            })()
          )),
          c = No(l);
        return (
          Ct(l, !0),
          Yd(a, u, l),
          32 != (32 & l.flags) && Qo(i, o, u, l),
          0 ===
            (function bv() {
              return P.lFrame.elementDepthCount;
            })() && Se(u, o),
          (function Mv() {
            P.lFrame.elementDepthCount++;
          })(),
          c && (Ha(i, o, l), ja(i, l, o)),
          null !== r && $a(o, l),
          ie
        );
      }
      function ye() {
        let e = we();
        Ns()
          ? (function Ps() {
              P.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Ct(e, !1));
        const t = e;
        !(function Iv() {
          P.lFrame.elementDepthCount--;
        })();
        const n = B();
        return (
          n.firstCreatePass && (Ro(n, e), Ss(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function Gv(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            Ja(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function zv(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Ja(n, t, y(), t.stylesWithoutHost, !1),
          ye
        );
      }
      function Ut(e, t, n, r) {
        return ie(e, t, n, r), ye(), Ut;
      }
      function pi(e) {
        return !!e && "function" == typeof e.then;
      }
      const vh = function Dh(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function ee(e, t, n, r) {
        const o = y(),
          i = B(),
          s = we();
        return (
          (function Ch(e, t, n, r, o, i, s) {
            const a = No(r),
              u = e.firstCreatePass && Xf(e),
              c = t[ue],
              d = Kf(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = Ze(r, t),
                D = s ? s(g) : g,
                v = d.length,
                b = s ? (A) => s(Ce(A[r.index])) : r.index;
              let m = null;
              if (
                (!s &&
                  a &&
                  (m = (function OE(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[Sn],
                            l = o[i + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== m)
              )
                ((m.__ngLastListenerFn__ || m).__ngNextListenerFn__ = i),
                  (m.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = Eh(r, t, c, i, !1);
                const A = n.listen(D, o, i);
                d.push(i, A), u && u.push(o, b, v, v + 1);
              }
            } else i = Eh(r, t, c, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let D = 0; D < g; D += 2) {
                  const q = t[p[D]][p[D + 1]].subscribe(i),
                    fe = d.length;
                  d.push(i, q), u && u.push(o, r.index, fe, -(fe + 1));
                }
            }
          })(i, o, o[L], s, e, t, r),
          ee
        );
      }
      function wh(e, t, n, r) {
        try {
          return et(6, t, n), !1 !== n(r);
        } catch (o) {
          return eh(e, o), !1;
        } finally {
          et(7, t, n);
        }
      }
      function Eh(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Za(e.componentOffset > -1 ? Ye(e.index, t) : t);
          let l = wh(t, n, r, s),
            u = i.__ngNextListenerFn__;
          for (; u; ) (l = wh(t, n, u, s) && l), (u = u.__ngNextListenerFn__);
          return o && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function nl(e = 1) {
        return (function xv(e) {
          return (P.lFrame.contextLView = (function Rv(e, t) {
            for (; e > 0; ) (t = t[An]), e--;
            return t;
          })(e, P.lFrame.contextLView))[ue];
        })(e);
      }
      function gi(e, t) {
        return (e << 17) | (t << 2);
      }
      function nn(e) {
        return (e >> 17) & 32767;
      }
      function ol(e) {
        return 2 | e;
      }
      function _n(e) {
        return (131068 & e) >> 2;
      }
      function il(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function sl(e) {
        return 1 | e;
      }
      function Ph(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? nn(i) : _n(i),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = e[a + 1];
          BE(e[a], t) && ((l = !0), (e[a + 1] = r ? sl(c) : ol(c))),
            (a = r ? nn(c) : _n(c));
        }
        l && (e[n + 1] = r ? ol(i) : sl(i));
      }
      function BE(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Bn(e, t) >= 0)
        );
      }
      function dt(e, t) {
        return (
          (function ft(e, t, n, r) {
            const o = y(),
              i = B(),
              s = (function Lt(e) {
                const t = P.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            i.firstUpdatePass &&
              (function $h(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[Re()],
                    s = (function Hh(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function Wh(e, t) {
                    return 0 != (e.flags & (t ? 8 : 16));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function ZE(e, t, n, r) {
                      const o = (function Rs(e) {
                        const t = P.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = Zr((n = al(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = al(o, e, t, n, r)), null === i)) {
                            let l = (function YE(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== _n(r)) return e[nn(r)];
                            })(e, t, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = al(null, e, t, l[1], r)),
                              (l = Zr(l, t.attrs, r)),
                              (function QE(e, t, n, r) {
                                e[nn(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, l));
                          } else
                            i = (function KE(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = Zr(r, e[i].hostAttrs, n);
                              return Zr(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (t.residualClasses = i)
                            : (t.residualStyles = i)),
                        n
                      );
                    })(o, i, t, r)),
                    (function LE(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = nn(s),
                        l = _n(s);
                      e[r] = n;
                      let c,
                        u = !1;
                      if (
                        (Array.isArray(n)
                          ? ((c = n[1]),
                            (null === c || Bn(n, c) > 0) && (u = !0))
                          : (c = n),
                        o)
                      )
                        if (0 !== l) {
                          const f = nn(e[a + 1]);
                          (e[r + 1] = gi(f, a)),
                            0 !== f && (e[f + 1] = il(e[f + 1], r)),
                            (e[a + 1] = (function RE(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = gi(a, 0)),
                            0 !== a && (e[a + 1] = il(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = gi(l, 0)),
                          0 === a ? (a = r) : (e[l + 1] = il(e[l + 1], r)),
                          (l = r);
                      u && (e[r + 1] = ol(e[r + 1])),
                        Ph(e, c, r, !0),
                        Ph(e, c, r, !1),
                        (function VE(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            Bn(i, t) >= 0 &&
                            (n[r + 1] = sl(n[r + 1]));
                        })(t, c, e, r, i),
                        (s = gi(a, l)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== x &&
                Ae(o, s, t) &&
                (function Gh(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const l = e.data,
                    u = l[a + 1],
                    c = (function kE(e) {
                      return 1 == (1 & e);
                    })(u)
                      ? zh(l, t, n, o, _n(u), s)
                      : void 0;
                  mi(c) ||
                    (mi(i) ||
                      ((function xE(e) {
                        return 2 == (2 & e);
                      })(u) &&
                        (i = zh(l, null, n, o, a, s))),
                    (function K_(e, t, n, r, o) {
                      if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : je.DashCase;
                        null == o
                          ? e.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= je.Important)),
                            e.setStyle(n, r, o, i));
                      }
                    })(r, s, Po(Re(), n), o, i));
                })(
                  i,
                  i.data[Re()],
                  o,
                  o[L],
                  e,
                  (o[s + 1] = (function eb(e, t) {
                    return (
                      null == e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e &&
                            (e = Z(
                              (function en(e) {
                                return e instanceof ef
                                  ? e.changingThisBreaksApplicationSecurity
                                  : e;
                              })(e)
                            ))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          dt
        );
      }
      function al(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = Zr(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Zr(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                Qe(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function zh(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const l = e[o],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = n[o + 1];
          f === x && (f = d ? H : void 0);
          let h = d ? Qs(f, r) : c === r ? f : void 0;
          if ((u && !mi(h) && (h = Qs(l, r)), mi(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? nn(p) : _n(p);
        }
        if (null !== t) {
          let l = i ? t.residualClasses : t.residualStyles;
          null != l && (a = Qs(l, r));
        }
        return a;
      }
      function mi(e) {
        return void 0 !== e;
      }
      function rt(e, t = "") {
        const n = y(),
          r = B(),
          o = e + J,
          i = r.firstCreatePass ? Yn(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function ua(e, t) {
            return e.createText(t);
          })(n[L], t));
        Qo(r, n, s, i), Ct(i, !1);
      }
      function ll(e) {
        return ul("", e, ""), ll;
      }
      function ul(e, t, n) {
        const r = y(),
          o = (function Kn(e, t, n, r) {
            return Ae(e, Nn(), n) ? t + N(n) + r : x;
          })(r, e, t, n);
        return (
          o !== x &&
            (function Ht(e, t, n) {
              const r = Po(t, e);
              !(function Rd(e, t, n) {
                e.setValue(t, n);
              })(e[L], r, n);
            })(r, Re(), o),
          ul
        );
      }
      const ar = "en-US";
      let pp = ar;
      function fl(e, t, n, r, o) {
        if (((e = I(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) fl(e[i], t, n, r, o);
        else {
          const i = B(),
            s = y();
          let a = Dn(e) ? e : I(e.provide),
            l = vf(e);
          const u = we(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            f = u.providerIndexes >> 20;
          if (Dn(e) || !e.multi) {
            const h = new Or(l, o, _),
              p = pl(a, t, o ? c : c + f, d);
            -1 === p
              ? (zs(Ho(u, s), i, a),
                hl(i, e, t.length),
                t.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = pl(a, t, c + f, d),
              p = pl(a, t, c, c + f),
              D = p >= 0 && n[p];
            if ((o && !D) || (!o && !(h >= 0 && n[h]))) {
              zs(Ho(u, s), i, a);
              const v = (function DM(e, t, n, r, o) {
                const i = new Or(e, n, _);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  Bp(i, o, r && !n),
                  i
                );
              })(o ? yM : mM, n.length, o, r, l);
              !o && D && (n[p].providerFactory = v),
                hl(i, e, t.length, 0),
                t.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(v),
                s.push(v);
            } else hl(i, e, h > -1 ? h : p, Bp(n[o ? p : h], l, !o && r));
            !o && r && D && n[p].componentProviders++;
          }
        }
      }
      function hl(e, t, n, r) {
        const o = Dn(t),
          i = (function AC(e) {
            return !!e.useClass;
          })(t);
        if (o || i) {
          const l = (i ? I(t.useClass) : t).prototype.ngOnDestroy;
          if (l) {
            const u = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
              const c = u.indexOf(n);
              -1 === c ? u.push(n, [r, l]) : u[c + 1].push(r, l);
            } else u.push(n, l);
          }
        }
      }
      function Bp(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function pl(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function mM(e, t, n, r) {
        return gl(this.multi, []);
      }
      function yM(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = gn(n, n[E], this.providerFactory.index, r);
          (i = a.slice(0, s)), gl(o, i);
          for (let l = s; l < a.length; l++) i.push(a[l]);
        } else (i = []), gl(o, i);
        return i;
      }
      function gl(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function ne(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function gM(e, t, n) {
              const r = B();
              if (r.firstCreatePass) {
                const o = ut(e);
                fl(n, r.data, r.blueprint, o, !0),
                  fl(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class lr {}
      class vM {}
      class jp extends lr {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new th(this));
          const r = (function We(e, t) {
            const n = e[Ec] || null;
            if (!n && !0 === t)
              throw new Error(
                `Type ${Z(e)} does not have '\u0275mod' property.`
              );
            return n;
          })(t);
          (this._bootstrapComponents = (function jt(e) {
            return e instanceof Function ? e() : e;
          })(r.bootstrap)),
            (this._r3Injector = xf(
              t,
              n,
              [
                { provide: lr, useValue: this },
                { provide: ri, useValue: this.componentFactoryResolver },
              ],
              Z(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class ml extends vM {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new jp(this.moduleType, t);
        }
      }
      function Zp(e, t, n, r, o) {
        return (function Qp(e, t, n, r, o, i, s) {
          const a = t + n;
          return (function vn(e, t, n, r) {
            const o = Ae(e, t, n);
            return Ae(e, t + 1, r) || o;
          })(e, a, o, i)
            ? (function bt(e, t, n) {
                return (e[t] = n);
              })(e, a + 2, s ? r.call(s, o, i) : r(o, i))
            : (function eo(e, t) {
                const n = e[t];
                return n === x ? void 0 : n;
              })(e, a + 2);
        })(
          y(),
          (function xe() {
            const e = P.lFrame;
            let t = e.bindingRootIndex;
            return (
              -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex),
              t
            );
          })(),
          e,
          t,
          n,
          r,
          o
        );
      }
      function Dl(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const te = class ZM extends us {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const l = t;
            (o = l.next?.bind(l)),
              (i = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((i = Dl(i)), o && (o = Dl(o)), s && (s = Dl(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof yt && t.add(a), a;
        }
      };
      function YM() {
        return this._results[Symbol.iterator]();
      }
      class vl {
        get changes() {
          return this._changes || (this._changes = new te());
        }
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const n = vl.prototype;
          n[Symbol.iterator] || (n[Symbol.iterator] = YM);
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, n) {
          return this._results.reduce(t, n);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, n) {
          const r = this;
          r.dirty = !1;
          const o = (function tt(e) {
            return e.flat(Number.POSITIVE_INFINITY);
          })(t);
          (this._changesDetected = !(function t_(e, t, n) {
            if (e.length !== t.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let o = e[r],
                i = t[r];
              if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
            }
            return !0;
          })(r._results, o, n)) &&
            ((r._results = o),
            (r.length = o.length),
            (r.last = o[this.length - 1]),
            (r.first = o[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let Gt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = XM), e;
      })();
      const QM = Gt,
        KM = class extends QM {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tViews,
              o = si(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                n || null
              );
            o[Ir] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[_t];
            return (
              null !== s && (o[_t] = s.createEmbeddedView(r)),
              Ba(r, o, t),
              new Gr(o)
            );
          }
        };
      function XM() {
        return Ci(we(), y());
      }
      function Ci(e, t) {
        return 4 & e.type ? new KM(t, e, zn(e, t)) : null;
      }
      let At = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = JM), e;
      })();
      function JM() {
        return ng(we(), y());
      }
      const e0 = At,
        eg = class extends e0 {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return zn(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new xn(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Gs(this._hostTNode, this._hostLView);
            if (td(t)) {
              const n = Bo(t, this._hostLView),
                r = Vo(t);
              return new xn(n[E].data[r + 8], n);
            }
            return new xn(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = tg(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - Pe;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function Pr(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.environmentInjector || d.ngModuleRef);
            }
            const l = s ? t : new zr(G(t)),
              u = r || this.parentInjector;
            if (!i && null == l.ngModule) {
              const f = (s ? u : this.parentInjector).get(Un, null);
              f && (i = f);
            }
            const c = l.create(u, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[E];
            if (
              (function Ev(e) {
                return lt(e[ae]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[ae],
                  f = new eg(d, d[be], d[ae]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function U_(e, t, n, r) {
              const o = Pe + r,
                i = n.length;
              r > 0 && (n[o - 1][at] = t),
                r < i - Pe
                  ? ((t[at] = n[o]), hd(n, Pe + r, t))
                  : (n.push(t), (t[at] = null)),
                (t[ae] = n);
              const s = t[Ir];
              null !== s &&
                n !== s &&
                (function G_(e, t) {
                  const n = e[On];
                  t[Me] !== t[ae][ae][Me] && (e[Tc] = !0),
                    null === n ? (e[On] = [t]) : n.push(t);
                })(s, t);
              const a = t[_t];
              null !== a && a.insertView(e), (t[R] |= 64);
            })(o, r, s, i);
            const a = pa(i, s),
              l = r[L],
              u = Yo(l, s[Oo]);
            return (
              null !== u &&
                (function j_(e, t, n, r, o, i) {
                  (r[xt] = o), (r[be] = t), Br(e, r, n, 1, o, i);
                })(o, s[be], l, r, u, a),
              t.attachToViewContainerRef(),
              hd(_l(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = tg(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = da(this._lContainer, n);
            r && (Uo(_l(this._lContainer), n), Ld(r[E], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = da(this._lContainer, n);
            return r && null != Uo(_l(this._lContainer), n) ? new Gr(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function tg(e) {
        return e[Fo];
      }
      function _l(e) {
        return e[Fo] || (e[Fo] = []);
      }
      function ng(e, t) {
        let n;
        const r = t[e.index];
        if (lt(r)) n = r;
        else {
          let o;
          if (8 & e.type) o = Ce(r);
          else {
            const i = t[L];
            o = i.createComment("");
            const s = Ze(e, t);
            yn(
              i,
              Yo(i, s),
              o,
              (function Z_(e, t) {
                return e.nextSibling(t);
              })(i, s),
              !1
            );
          }
          (t[e.index] = n = Qf(r, t, o, e)), li(t, n);
        }
        return new eg(n, e, t);
      }
      class Cl {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new Cl(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class wl {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const n = t.queries;
          if (null !== n) {
            const r =
                null !== t.contentQueries ? t.contentQueries[0] : n.length,
              o = [];
            for (let i = 0; i < r; i++) {
              const s = n.getByIndex(i);
              o.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new wl(o);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let n = 0; n < this.queries.length; n++)
            null !== cg(t, n).matches && this.queries[n].setDirty();
        }
      }
      class rg {
        constructor(t, n, r = null) {
          (this.predicate = t), (this.flags = n), (this.read = r);
        }
      }
      class El {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, n);
        }
        elementEnd(t) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementEnd(t);
        }
        embeddedTView(t) {
          let n = null;
          for (let r = 0; r < this.length; r++) {
            const o = null !== n ? n.length : 0,
              i = this.getByIndex(r).embeddedTView(t, o);
            i &&
              ((i.indexInDeclarationView = r),
              null !== n ? n.push(i) : (n = [i]));
          }
          return null !== n ? new El(n) : null;
        }
        template(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, n);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class bl {
        constructor(t, n = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = n);
        }
        elementStart(t, n) {
          this.isApplyingToNode(n) && this.matchTNode(t, n);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, n) {
          this.elementStart(t, n);
        }
        embeddedTView(t, n) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, n),
              new bl(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const n = this._declarationNodeIndex;
            let r = t.parent;
            for (; null !== r && 8 & r.type && r.index !== n; ) r = r.parent;
            return n === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, n) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let o = 0; o < r.length; o++) {
              const i = r[o];
              this.matchTNodeWithReadOption(t, n, t0(n, i)),
                this.matchTNodeWithReadOption(t, n, $o(n, t, i, !1, !1));
            }
          else
            r === Gt
              ? 4 & n.type && this.matchTNodeWithReadOption(t, n, -1)
              : this.matchTNodeWithReadOption(t, n, $o(n, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, n, r) {
          if (null !== r) {
            const o = this.metadata.read;
            if (null !== o)
              if (o === $e || o === At || (o === Gt && 4 & n.type))
                this.addMatch(n.index, -2);
              else {
                const i = $o(n, t, o, !1, !1);
                null !== i && this.addMatch(n.index, i);
              }
            else this.addMatch(n.index, r);
          }
        }
        addMatch(t, n) {
          null === this.matches
            ? (this.matches = [t, n])
            : this.matches.push(t, n);
        }
      }
      function t0(e, t) {
        const n = e.localNames;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
        return null;
      }
      function r0(e, t, n, r) {
        return -1 === n
          ? (function n0(e, t) {
              return 11 & e.type ? zn(e, t) : 4 & e.type ? Ci(e, t) : null;
            })(t, e)
          : -2 === n
          ? (function o0(e, t, n) {
              return n === $e
                ? zn(t, e)
                : n === Gt
                ? Ci(t, e)
                : n === At
                ? ng(t, e)
                : void 0;
            })(e, t, r)
          : gn(e, e[E], n, t);
      }
      function og(e, t, n, r) {
        const o = t[_t].queries[r];
        if (null === o.matches) {
          const i = e.data,
            s = n.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const u = s[l];
            a.push(u < 0 ? null : r0(t, i[u], s[l + 1], n.metadata.read));
          }
          o.matches = a;
        }
        return o.matches;
      }
      function Ml(e, t, n, r) {
        const o = e.queries.getByIndex(n),
          i = o.matches;
        if (null !== i) {
          const s = og(e, t, o, n);
          for (let a = 0; a < i.length; a += 2) {
            const l = i[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const u = i[a + 1],
                c = t[-l];
              for (let d = Pe; d < c.length; d++) {
                const f = c[d];
                f[Ir] === f[ae] && Ml(f[E], f, u, r);
              }
              if (null !== c[On]) {
                const d = c[On];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  Ml(h[E], h, u, r);
                }
              }
            }
          }
        }
        return r;
      }
      function ig(e) {
        const t = y(),
          n = B(),
          r = zc();
        ks(r + 1);
        const o = cg(n, r);
        if (
          e.dirty &&
          (function wv(e) {
            return 4 == (4 & e[R]);
          })(t) ===
            (2 == (2 & o.metadata.flags))
        ) {
          if (null === o.matches) e.reset([]);
          else {
            const i = o.crossesNgTemplate ? Ml(n, t, r, []) : og(n, t, o, r);
            e.reset(i, BC), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function sg(e, t, n, r) {
        const o = B();
        if (o.firstCreatePass) {
          const i = we();
          (function ug(e, t, n) {
            null === e.queries && (e.queries = new El()),
              e.queries.track(new bl(t, n));
          })(o, new rg(t, n, r), i.index),
            (function l0(e, t) {
              const n = e.contentQueries || (e.contentQueries = []);
              t !== (n.length ? n[n.length - 1] : -1) &&
                n.push(e.queries.length - 1, t);
            })(o, e),
            2 == (2 & n) && (o.staticContentQueries = !0);
        }
        !(function lg(e, t, n) {
          const r = new vl(4 == (4 & n));
          Gf(e, t, r, r.destroy),
            null === t[_t] && (t[_t] = new wl()),
            t[_t].queries.push(new Cl(r));
        })(o, y(), n);
      }
      function cg(e, t) {
        return e.queries.getByIndex(t);
      }
      function Ei(...e) {}
      const Tg = new F("Application Initializer");
      let bi = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Ei),
              (this.reject = Ei),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (pi(i)) n.push(i);
                else if (vh(i)) {
                  const s = new Promise((a, l) => {
                    i.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(Tg, 8));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ro = new F("AppId", {
        providedIn: "root",
        factory: function Og() {
          return `${Ol()}${Ol()}${Ol()}`;
        },
      });
      function Ol() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Fg = new F("Platform Initializer"),
        Ng = new F("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        T0 = new F("appBootstrapListener"),
        zt = new F("LocaleId", {
          providedIn: "root",
          factory: () =>
            Cr(zt, O.Optional | O.SkipSelf) ||
            (function O0() {
              return (typeof $localize < "u" && $localize.locale) || ar;
            })(),
        }),
        R0 = (() => Promise.resolve(0))();
      function Fl(e) {
        typeof Zone > "u"
          ? R0.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class _e {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new te(!1)),
            (this.onMicrotaskEmpty = new te(!1)),
            (this.onStable = new te(!1)),
            (this.onError = new te(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function k0() {
              let e = X.requestAnimationFrame,
                t = X.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function B0(e) {
              const t = () => {
                !(function V0(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(X, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Pl(e),
                                (e.isCheckStableRunning = !0),
                                Nl(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Pl(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Rg(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      kg(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, l) => {
                  try {
                    return Rg(e), n.invoke(o, i, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), kg(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Pl(e),
                          Nl(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!_e.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (_e.isInAngularZone()) throw new C(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, L0, Ei, Ei);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const L0 = {};
      function Nl(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Pl(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Rg(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function kg(e) {
        e._nesting--, Nl(e);
      }
      class j0 {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new te()),
            (this.onMicrotaskEmpty = new te()),
            (this.onStable = new te()),
            (this.onError = new te());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const Lg = new F(""),
        Mi = new F("");
      let kl,
        xl = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                kl ||
                  ((function H0(e) {
                    kl = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      _e.assertNotInAngularZone(),
                        Fl(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Fl(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(j(_e), j(Rl), j(Mi));
            }),
            (e.ɵprov = K({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Rl = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return kl?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = K({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        rn = null;
      const Vg = new F("AllowMultipleToken"),
        Ll = new F("PlatformDestroyListeners"),
        Wt = !1;
      function jg(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new F(r);
        return (i = []) => {
          let s = Vl();
          if (!s || s.injector.get(Vg, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function G0(e) {
                  if (rn && !rn.get(Vg, !1)) throw new C(400, !1);
                  rn = e;
                  const t = e.get($g);
                  (function Bg(e) {
                    const t = e.get(Fg, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function Hg(e = [], t) {
                    return tn.create({
                      name: t,
                      providers: [
                        { provide: Sa, useValue: "platform" },
                        { provide: Ll, useValue: new Set([() => (rn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function W0(e) {
            const t = Vl();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function Vl() {
        return rn?.get($g) ?? null;
      }
      let $g = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function Gg(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new j0()
                      : ("zone.js" === e ? void 0 : e) || new _e(t)),
                  n
                );
              })(
                r?.ngZone,
                (function Ug(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: _e, useValue: o }];
            return o.run(() => {
              const s = tn.create({
                  providers: i,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                l = a.injector.get(Wn, null);
              if (!l) throw new C(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const u = o.onError.subscribe({
                    next: (c) => {
                      l.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    Ii(this._modules, a), u.unsubscribe();
                  });
                }),
                (function zg(e, t, n) {
                  try {
                    const r = n();
                    return pi(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(l, o, () => {
                  const u = a.injector.get(bi);
                  return (
                    u.runInitializers(),
                    u.donePromise.then(
                      () => (
                        (function gp(e) {
                          Xe(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (pp = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(zt, ar) || ar),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = Wg({}, r);
            return (function $0(e, t, n) {
              const r = new ml(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Bl);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Ll, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(tn));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function Wg(e, t) {
        return Array.isArray(t) ? t.reduce(Wg, e) : { ...e, ...t };
      }
      let Bl = (() => {
        class e {
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const i = new Fe((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new Fe((a) => {
                let l;
                this._zone.runOutsideAngular(() => {
                  l = this._zone.onStable.subscribe(() => {
                    _e.assertNotInAngularZone(),
                      Fl(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const u = this._zone.onUnstable.subscribe(() => {
                  _e.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  l.unsubscribe(), u.unsubscribe();
                };
              });
            this.isStable = GD(
              i,
              s.pipe(
                (function zD(e = {}) {
                  const {
                    connector: t = () => new us(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s,
                      a,
                      l,
                      u = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = l = void 0), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return yr((g, D) => {
                      u++, !d && !c && f();
                      const v = (l = l ?? t());
                      D.add(() => {
                        u--, 0 === u && !d && !c && (a = hs(p, o));
                      }),
                        v.subscribe(D),
                        !s &&
                          u > 0 &&
                          ((s = new mr({
                            next: (b) => v.next(b),
                            error: (b) => {
                              (d = !0), f(), (a = hs(h, n, b)), v.error(b);
                            },
                            complete: () => {
                              (c = !0), f(), (a = hs(h, r)), v.complete();
                            },
                          })),
                          Yt(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            const o = n instanceof _f;
            if (!this._injector.get(bi).done) {
              !o &&
                (function br(e) {
                  const t = G(e) || Ee(e) || Ne(e);
                  return null !== t && t.standalone;
                })(n);
              throw new C(405, Wt);
            }
            let s;
            (s = o ? n : this._injector.get(ri).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function U0(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(lr),
              u = s.create(tn.NULL, [], r || s.selector, a),
              c = u.location.nativeElement,
              d = u.injector.get(Lg, null);
            return (
              d?.registerApplication(c),
              u.onDestroy(() => {
                this.detachView(u.hostView),
                  Ii(this.components, u),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Ii(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(T0, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Ii(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(_e), j(Un), j(Wn));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Ii(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Yg = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = Z0), e;
      })();
      function Z0(e) {
        return (function Y0(e, t, n) {
          if (Ar(e) && !n) {
            const r = Ye(e.index, t);
            return new Gr(r, r);
          }
          return 47 & e.type ? new Gr(t[Me], t) : null;
        })(we(), y(), 16 == (16 & e));
      }
      class Xg {
        constructor() {}
        supports(t) {
          return fi(t);
        }
        create(t) {
          return new tI(t);
        }
      }
      const eI = (e, t) => t;
      class tI {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || eI);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < em(r, o, i)) ? n : r,
              a = em(s, o, i),
              l = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const u = a - o,
                c = l - o;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < u && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - u;
              }
            }
            a !== l && t(s, a, l);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !fi(t))) throw new C(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function wE(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new nI(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Jg()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Jg()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class nI {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class rI {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Jg {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new rI()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function em(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      class tm {
        constructor() {}
        supports(t) {
          return t instanceof Map || Xa(t);
        }
        create() {
          return new oI();
        }
      }
      class oI {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(t) {
          let n;
          for (n = this._mapHead; null !== n; n = n._next) t(n);
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachChangedItem(t) {
          let n;
          for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || Xa(t))) throw new C(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let n = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, o) => {
              if (n && n.key === o)
                this._maybeAddToChanges(n, r),
                  (this._appendAfter = n),
                  (n = n._next);
              else {
                const i = this._getOrCreateRecordForKey(o, r);
                n = this._insertBeforeOrAppend(n, i);
              }
            }),
            n)
          ) {
            n._prev && (n._prev._next = null), (this._removalsHead = n);
            for (let r = n; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, n) {
          if (t) {
            const r = t._prev;
            return (
              (n._next = t),
              (n._prev = r),
              (t._prev = n),
              r && (r._next = n),
              t === this._mapHead && (this._mapHead = n),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
              : (this._mapHead = n),
            (this._appendAfter = n),
            null
          );
        }
        _getOrCreateRecordForKey(t, n) {
          if (this._records.has(t)) {
            const o = this._records.get(t);
            this._maybeAddToChanges(o, n);
            const i = o._prev,
              s = o._next;
            return (
              i && (i._next = s),
              s && (s._prev = i),
              (o._next = null),
              (o._prev = null),
              o
            );
          }
          const r = new iI(t);
          return (
            this._records.set(t, r),
            (r.currentValue = n),
            this._addToAdditions(r),
            r
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, n) {
          Object.is(n, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = n),
            this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, n) {
          t instanceof Map
            ? t.forEach(n)
            : Object.keys(t).forEach((r) => n(t[r], r));
        }
      }
      class iI {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function nm() {
        return new Ti([new Xg()]);
      }
      let Ti = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || nm()),
              deps: [[e, new Wo(), new zo()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new C(901, !1);
          }
        }
        return (e.ɵprov = K({ token: e, providedIn: "root", factory: nm })), e;
      })();
      function rm() {
        return new oo([new tm()]);
      }
      let oo = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || rm()),
              deps: [[e, new Wo(), new zo()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (r) return r;
            throw new C(901, !1);
          }
        }
        return (e.ɵprov = K({ token: e, providedIn: "root", factory: rm })), e;
      })();
      const lI = jg(null, "core", []);
      let uI = (() => {
        class e {
          constructor(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(Bl));
          }),
          (e.ɵmod = Pt({ type: e })),
          (e.ɵinj = Dt({})),
          e
        );
      })();
      let zl = null;
      function dr() {
        return zl;
      }
      class fI {}
      const qt = new F("DocumentToken"),
        tu = /\s+/,
        hm = [];
      let pm = (() => {
        class e {
          constructor(n, r, o, i) {
            (this._iterableDiffers = n),
              (this._keyValueDiffers = r),
              (this._ngEl = o),
              (this._renderer = i),
              (this.initialClasses = hm),
              (this.stateMap = new Map());
          }
          set klass(n) {
            this.initialClasses = null != n ? n.trim().split(tu) : hm;
          }
          set ngClass(n) {
            this.rawClass = "string" == typeof n ? n.trim().split(tu) : n;
          }
          ngDoCheck() {
            for (const r of this.initialClasses) this._updateState(r, !0);
            const n = this.rawClass;
            if (Array.isArray(n) || n instanceof Set)
              for (const r of n) this._updateState(r, !0);
            else if (null != n)
              for (const r of Object.keys(n))
                this._updateState(r, Boolean(n[r]));
            this._applyStateDiff();
          }
          _updateState(n, r) {
            const o = this.stateMap.get(n);
            void 0 !== o
              ? (o.enabled !== r && ((o.changed = !0), (o.enabled = r)),
                (o.touched = !0))
              : this.stateMap.set(n, { enabled: r, changed: !0, touched: !0 });
          }
          _applyStateDiff() {
            for (const n of this.stateMap) {
              const r = n[0],
                o = n[1];
              o.changed
                ? (this._toggleClass(r, o.enabled), (o.changed = !1))
                : o.touched ||
                  (o.enabled && this._toggleClass(r, !1),
                  this.stateMap.delete(r)),
                (o.touched = !1);
            }
          }
          _toggleClass(n, r) {
            (n = n.trim()).length > 0 &&
              n.split(tu).forEach((o) => {
                r
                  ? this._renderer.addClass(this._ngEl.nativeElement, o)
                  : this._renderer.removeClass(this._ngEl.nativeElement, o);
              });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(Ti), _(oo), _($e), _(Bt));
          }),
          (e.ɵdir = T({
            type: e,
            selectors: [["", "ngClass", ""]],
            inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
            standalone: !0,
          })),
          e
        );
      })();
      class JI {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let ym = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new JI(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), Dm(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              Dm(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(At), _(Gt), _(Ti));
          }),
          (e.ɵdir = T({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function Dm(e, t) {
        e.context.$implicit = t.item;
      }
      let vm = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new tS()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            _m("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            _m("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(At), _(Gt));
          }),
          (e.ɵdir = T({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          e
        );
      })();
      class tS {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function _m(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${Z(t)}'.`
          );
      }
      let Em = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Pt({ type: e })),
          (e.ɵinj = Dt({})),
          e
        );
      })();
      class rA extends fI {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class lu extends rA {
        static makeCurrent() {
          !(function dI(e) {
            zl || (zl = e);
          })(new lu());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function oA() {
            return (
              (lo = lo || document.querySelector("base")),
              lo ? lo.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function iA(e) {
                (Hi = Hi || document.createElement("a")),
                  Hi.setAttribute("href", e);
                const t = Hi.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          lo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function KI(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Hi,
        lo = null;
      const Om = new F("TRANSITION_ID"),
        aA = [
          {
            provide: Tg,
            useFactory: function sA(e, t, n) {
              return () => {
                n.get(bi).donePromise.then(() => {
                  const r = dr(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Om, qt, tn],
            multi: !0,
          },
        ];
      let uA = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const $i = new F("EventManagerPlugins");
      let Ui = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j($i), j(_e));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Fm {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = dr().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Nm = (() => {
          class e {
            constructor() {
              this.usageCount = new Map();
            }
            addStyles(n) {
              for (const r of n)
                1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
            }
            removeStyles(n) {
              for (const r of n)
                0 === this.changeUsageCount(r, -1) && this.onStyleRemoved(r);
            }
            onStyleRemoved(n) {}
            onStyleAdded(n) {}
            getAllStyles() {
              return this.usageCount.keys();
            }
            changeUsageCount(n, r) {
              const o = this.usageCount;
              let i = o.get(n) ?? 0;
              return (i += r), i > 0 ? o.set(n, i) : o.delete(n), i;
            }
            ngOnDestroy() {
              for (const n of this.getAllStyles()) this.onStyleRemoved(n);
              this.usageCount.clear();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = K({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        uo = (() => {
          class e extends Nm {
            constructor(n) {
              super(),
                (this.doc = n),
                (this.styleRef = new Map()),
                (this.hostNodes = new Set()),
                this.resetHostNodes();
            }
            onStyleAdded(n) {
              for (const r of this.hostNodes) this.addStyleToHost(r, n);
            }
            onStyleRemoved(n) {
              const r = this.styleRef;
              r.get(n)?.forEach((i) => i.remove()), r.delete(n);
            }
            ngOnDestroy() {
              super.ngOnDestroy(), this.styleRef.clear(), this.resetHostNodes();
            }
            addHost(n) {
              this.hostNodes.add(n);
              for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
            }
            removeHost(n) {
              this.hostNodes.delete(n);
            }
            addStyleToHost(n, r) {
              const o = this.doc.createElement("style");
              (o.textContent = r), n.appendChild(o);
              const i = this.styleRef.get(r);
              i ? i.push(o) : this.styleRef.set(r, [o]);
            }
            resetHostNodes() {
              const n = this.hostNodes;
              n.clear(), n.add(this.doc.head);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(j(qt));
            }),
            (e.ɵprov = K({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const uu = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        cu = /%COMP%/g,
        Rm = new F("RemoveStylesOnCompDestory", {
          providedIn: "root",
          factory: () => !1,
        });
      function km(e, t) {
        return t.flat(100).map((n) => n.replace(cu, e));
      }
      function Lm(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let du = (() => {
        class e {
          constructor(n, r, o, i) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestory = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new fu(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof jm
                ? o.applyToHost(n)
                : o instanceof hu && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(n, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.eventManager,
                a = this.sharedStylesHost,
                l = this.removeStylesOnCompDestory;
              switch (r.encapsulation) {
                case vt.Emulated:
                  i = new jm(s, a, r, this.appId, l);
                  break;
                case vt.ShadowDom:
                  return new mA(s, a, n, r);
                default:
                  i = new hu(s, a, r, l);
              }
              (i.onDestroy = () => o.delete(r.id)), o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(Ui), j(uo), j(ro), j(Rm));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class fu {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(uu[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (Bm(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Bm(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = uu[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = uu[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (je.DashCase | je.Important)
            ? t.style.setProperty(n, r, o & je.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & je.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Lm(r))
            : this.eventManager.addEventListener(t, n, Lm(r));
        }
      }
      function Bm(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class mA extends fu {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = km(o.id, o.styles);
          for (const s of i) {
            const a = document.createElement("style");
            (a.textContent = s), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class hu extends fu {
        constructor(t, n, r, o, i = r.id) {
          super(t),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestory = o),
            (this.rendererUsageCount = 0),
            (this.styles = km(i, r.styles));
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles),
            this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class jm extends hu {
        constructor(t, n, r, o, i) {
          const s = o + "-" + r.id;
          super(t, n, r, i, s),
            (this.contentAttr = (function hA(e) {
              return "_ngcontent-%COMP%".replace(cu, e);
            })(s)),
            (this.hostAttr = (function pA(e) {
              return "_nghost-%COMP%".replace(cu, e);
            })(s));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let yA = (() => {
        class e extends Fm {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(qt));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Hm = ["alt", "control", "meta", "shift"],
        DA = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        vA = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let _A = (() => {
        class e extends Fm {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => dr().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              Hm.forEach((u) => {
                const c = r.indexOf(u);
                c > -1 && (r.splice(c, 1), (s += u + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const l = {};
            return (l.domEventName = o), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(n, r) {
            let o = DA[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                Hm.forEach((s) => {
                  s !== o && (0, vA[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(qt));
          }),
          (e.ɵprov = K({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const bA = jg(lI, "browser", [
          { provide: Ng, useValue: "browser" },
          {
            provide: Fg,
            useValue: function CA() {
              lu.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: qt,
            useFactory: function EA() {
              return (
                (function nC(e) {
                  Da = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        Gm = new F(""),
        zm = [
          {
            provide: Mi,
            useClass: class lA {
              addToWindow(t) {
                (X.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i)
                    throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (X.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (X.getAllAngularRootElements = () => t.getAllRootElements()),
                  X.frameworkStabilizers || (X.frameworkStabilizers = []),
                  X.frameworkStabilizers.push((r) => {
                    const o = X.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), i--, 0 == i && r(s);
                    };
                    o.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? dr().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: Lg, useClass: xl, deps: [_e, Rl, Mi] },
          { provide: xl, useClass: xl, deps: [_e, Rl, Mi] },
        ],
        Wm = [
          { provide: Sa, useValue: "root" },
          {
            provide: Wn,
            useFactory: function wA() {
              return new Wn();
            },
            deps: [],
          },
          { provide: $i, useClass: yA, multi: !0, deps: [qt, _e, Ng] },
          { provide: $i, useClass: _A, multi: !0, deps: [qt] },
          { provide: du, useClass: du, deps: [Ui, uo, ro, Rm] },
          { provide: wf, useExisting: du },
          { provide: Nm, useExisting: uo },
          { provide: uo, useClass: uo, deps: [qt] },
          { provide: Ui, useClass: Ui, deps: [$i, _e] },
          { provide: class OS {}, useClass: uA, deps: [] },
          [],
        ];
      let MA = (() => {
        class e {
          constructor(n) {}
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [
                { provide: ro, useValue: n.appId },
                { provide: Om, useExisting: ro },
                aA,
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(j(Gm, 12));
          }),
          (e.ɵmod = Pt({ type: e })),
          (e.ɵinj = Dt({ providers: [...Wm, ...zm], imports: [Em, uI] })),
          e
        );
      })();
      typeof window < "u" && window;
      const Ym = ["move", "copy", "link"],
        Gi = "application/x-dnd",
        mu = "application/json",
        zi = "Text";
      function Qm(e) {
        return e.substr(0, Gi.length) === Gi;
      }
      function Km(e) {
        if (e.dataTransfer) {
          const t = e.dataTransfer.types;
          if (!t) return zi;
          for (let n = 0; n < t.length; n++)
            if (t[n] === zi || t[n] === mu || Qm(t[n])) return t[n];
        }
        return null;
      }
      function Wi(e, t) {
        return "all" === t || "uninitialized" === t
          ? e
          : e.filter(function (n) {
              return -1 !== t.toLowerCase().indexOf(n);
            });
      }
      function BA(e, t) {
        const n = window.getComputedStyle(t),
          r = parseFloat(n.paddingTop) || 0,
          o = parseFloat(n.paddingLeft) || 0,
          i = parseFloat(n.borderTopWidth) || 0,
          s = parseFloat(n.borderLeftWidth) || 0;
        return { x: e.offsetX + o + s, y: e.offsetY + r + i };
      }
      const Te = {
        isDragging: !1,
        dropEffect: "none",
        effectAllowed: "all",
        type: void 0,
      };
      function Xm() {
        (Te.isDragging = !1),
          (Te.dropEffect = void 0),
          (Te.effectAllowed = void 0),
          (Te.type = void 0);
      }
      function yu(e, t) {
        !0 === Te.isDragging && (Te.dropEffect = t),
          e.dataTransfer && (e.dataTransfer.dropEffect = t);
      }
      function Jm(e, t) {
        let r = Wi(
          Ym,
          e.dataTransfer ? e.dataTransfer.effectAllowed : "uninitialized"
        );
        return (
          !0 === Te.isDragging && (r = Wi(r, Te.effectAllowed)),
          t && (r = Wi(r, t)),
          0 === r.length
            ? "none"
            : e.ctrlKey && -1 !== r.indexOf("copy")
            ? "copy"
            : e.altKey && -1 !== r.indexOf("link")
            ? "link"
            : r[0]
        );
      }
      function Du(e) {
        if (!0 === Te.isDragging) return Te.type;
        const t = Km(e);
        return (
          (null !== t && t !== zi && t !== mu && t.substr(Gi.length + 1)) ||
          void 0
        );
      }
      function vu() {
        return !1 === Te.isDragging;
      }
      const ey = Te;
      let $A = (() => {
          class e {
            constructor() {
              (this.dndEffectAllowed = "copy"),
                (this.dndDraggingClass = "dndDragging"),
                (this.dndDraggingSourceClass = "dndDraggingSource"),
                (this.dndDraggableDisabledClass = "dndDraggableDisabled"),
                (this.dndDragImageOffsetFunction = BA),
                (this.dndStart = new te()),
                (this.dndDrag = new te()),
                (this.dndEnd = new te()),
                (this.dndMoved = new te()),
                (this.dndCopied = new te()),
                (this.dndLinked = new te()),
                (this.dndCanceled = new te()),
                (this.draggable = !0),
                (this.isDragStarted = !1),
                (this.elementRef = Cr($e)),
                (this.renderer = Cr(Bt)),
                (this.ngZone = Cr(_e)),
                (this.dragEventHandler = (n) => this.onDrag(n));
            }
            set dndDisableIf(n) {
              (this.draggable = !n),
                this.draggable
                  ? this.renderer.removeClass(
                      this.elementRef.nativeElement,
                      this.dndDraggableDisabledClass
                    )
                  : this.renderer.addClass(
                      this.elementRef.nativeElement,
                      this.dndDraggableDisabledClass
                    );
            }
            set dndDisableDragIf(n) {
              this.dndDisableIf = n;
            }
            ngAfterViewInit() {
              this.ngZone.runOutsideAngular(() => {
                this.elementRef.nativeElement.addEventListener(
                  "drag",
                  this.dragEventHandler
                );
              });
            }
            ngOnDestroy() {
              this.elementRef.nativeElement.removeEventListener(
                "drag",
                this.dragEventHandler
              ),
                this.isDragStarted && Xm();
            }
            onDragStart(n) {
              if (!this.draggable) return !1;
              if (null != this.dndHandle && null == n._dndUsingHandle)
                return n.stopPropagation(), !1;
              (function HA(e, t, n) {
                (Te.isDragging = !0),
                  (Te.dropEffect = "none"),
                  (Te.effectAllowed = t),
                  (Te.type = n),
                  e.dataTransfer && (e.dataTransfer.effectAllowed = t);
              })(n, this.dndEffectAllowed, this.dndType),
                (this.isDragStarted = !0),
                (function RA(e, t, n) {
                  const r = Gi + (t.type ? "-" + t.type : ""),
                    o = JSON.stringify(t);
                  try {
                    e.dataTransfer?.setData(r, o);
                  } catch {
                    try {
                      e.dataTransfer?.setData(mu, o);
                    } catch {
                      const a = Wi(Ym, n);
                      e.dataTransfer && (e.dataTransfer.effectAllowed = a[0]),
                        e.dataTransfer?.setData(zi, o);
                    }
                  }
                })(
                  n,
                  { data: this.dndDraggable, type: this.dndType },
                  ey.effectAllowed
                ),
                (this.dragImage = this.determineDragImage()),
                this.renderer.addClass(this.dragImage, this.dndDraggingClass),
                (null != this.dndDragImageElementRef ||
                  null != n._dndUsingHandle) &&
                  (function jA(e, t, n) {
                    const r = n(e, t) || { x: 0, y: 0 };
                    e.dataTransfer.setDragImage(t, r.x, r.y);
                  })(n, this.dragImage, this.dndDragImageOffsetFunction);
              const r = this.renderer.listen(
                this.elementRef.nativeElement,
                "drag",
                () => {
                  this.renderer.addClass(
                    this.elementRef.nativeElement,
                    this.dndDraggingSourceClass
                  ),
                    r();
                }
              );
              return (
                this.dndStart.emit(n),
                n.stopPropagation(),
                setTimeout(() => {
                  this.renderer.setStyle(
                    this.dragImage,
                    "pointer-events",
                    "none"
                  );
                }, 100),
                !0
              );
            }
            onDrag(n) {
              this.dndDrag.emit(n);
            }
            onDragEnd(n) {
              const r = ey.dropEffect;
              let o;
              switch (
                (this.renderer.setStyle(
                  this.dragImage,
                  "pointer-events",
                  "unset"
                ),
                r)
              ) {
                case "copy":
                  o = this.dndCopied;
                  break;
                case "link":
                  o = this.dndLinked;
                  break;
                case "move":
                  o = this.dndMoved;
                  break;
                default:
                  o = this.dndCanceled;
              }
              o.emit(n),
                this.dndEnd.emit(n),
                Xm(),
                (this.isDragStarted = !1),
                this.renderer.removeClass(
                  this.dragImage,
                  this.dndDraggingClass
                ),
                window.setTimeout(() => {
                  this.renderer.removeClass(
                    this.elementRef.nativeElement,
                    this.dndDraggingSourceClass
                  );
                }, 0),
                n.stopPropagation();
            }
            registerDragHandle(n) {
              this.dndHandle = n;
            }
            registerDragImage(n) {
              this.dndDragImageElementRef = n;
            }
            determineDragImage() {
              return typeof this.dndDragImageElementRef < "u"
                ? this.dndDragImageElementRef.nativeElement
                : this.elementRef.nativeElement;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = T({
              type: e,
              selectors: [["", "dndDraggable", ""]],
              hostVars: 1,
              hostBindings: function (n, r) {
                1 & n &&
                  ee("dragstart", function (i) {
                    return r.onDragStart(i);
                  })("dragend", function (i) {
                    return r.onDragEnd(i);
                  }),
                  2 & n && Mt("draggable", r.draggable);
              },
              inputs: {
                dndDraggable: "dndDraggable",
                dndEffectAllowed: "dndEffectAllowed",
                dndType: "dndType",
                dndDraggingClass: "dndDraggingClass",
                dndDraggingSourceClass: "dndDraggingSourceClass",
                dndDraggableDisabledClass: "dndDraggableDisabledClass",
                dndDragImageOffsetFunction: "dndDragImageOffsetFunction",
                dndDisableIf: "dndDisableIf",
                dndDisableDragIf: "dndDisableDragIf",
              },
              outputs: {
                dndStart: "dndStart",
                dndDrag: "dndDrag",
                dndEnd: "dndEnd",
                dndMoved: "dndMoved",
                dndCopied: "dndCopied",
                dndLinked: "dndLinked",
                dndCanceled: "dndCanceled",
              },
            })),
            e
          );
        })(),
        ty = (() => {
          class e {
            constructor(n) {
              this.elementRef = n;
            }
            ngOnInit() {
              this.elementRef.nativeElement.style.pointerEvents = "none";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_($e));
            }),
            (e.ɵdir = T({
              type: e,
              selectors: [["", "dndPlaceholderRef", ""]],
            })),
            e
          );
        })(),
        UA = (() => {
          class e {
            constructor(n, r, o) {
              (this.ngZone = n),
                (this.elementRef = r),
                (this.renderer = o),
                (this.dndDropzone = ""),
                (this.dndEffectAllowed = "uninitialized"),
                (this.dndAllowExternal = !1),
                (this.dndHorizontal = !1),
                (this.dndDragoverClass = "dndDragover"),
                (this.dndDropzoneDisabledClass = "dndDropzoneDisabled"),
                (this.dndDragover = new te()),
                (this.dndDrop = new te()),
                (this.placeholder = null),
                (this.disabled = !1),
                (this.dragEnterEventHandler = (i) => this.onDragEnter(i)),
                (this.dragOverEventHandler = (i) => this.onDragOver(i)),
                (this.dragLeaveEventHandler = (i) => this.onDragLeave(i));
            }
            set dndDisableIf(n) {
              (this.disabled = n),
                this.disabled
                  ? this.renderer.addClass(
                      this.elementRef.nativeElement,
                      this.dndDropzoneDisabledClass
                    )
                  : this.renderer.removeClass(
                      this.elementRef.nativeElement,
                      this.dndDropzoneDisabledClass
                    );
            }
            set dndDisableDropIf(n) {
              this.dndDisableIf = n;
            }
            ngAfterViewInit() {
              (this.placeholder = this.tryGetPlaceholder()),
                this.removePlaceholderFromDOM(),
                this.ngZone.runOutsideAngular(() => {
                  this.elementRef.nativeElement.addEventListener(
                    "dragenter",
                    this.dragEnterEventHandler
                  ),
                    this.elementRef.nativeElement.addEventListener(
                      "dragover",
                      this.dragOverEventHandler
                    ),
                    this.elementRef.nativeElement.addEventListener(
                      "dragleave",
                      this.dragLeaveEventHandler
                    );
                });
            }
            ngOnDestroy() {
              this.elementRef.nativeElement.removeEventListener(
                "dragenter",
                this.dragEnterEventHandler
              ),
                this.elementRef.nativeElement.removeEventListener(
                  "dragover",
                  this.dragOverEventHandler
                ),
                this.elementRef.nativeElement.removeEventListener(
                  "dragleave",
                  this.dragLeaveEventHandler
                );
            }
            onDragEnter(n) {
              if (!0 === n._dndDropzoneActive)
                return void this.cleanupDragoverState();
              if (null == n._dndDropzoneActive) {
                const o = document.elementFromPoint(n.clientX, n.clientY);
                this.elementRef.nativeElement.contains(o) &&
                  (n._dndDropzoneActive = !0);
              }
              const r = Du(n);
              this.isDropAllowed(r) && n.preventDefault();
            }
            onDragOver(n) {
              if (n.defaultPrevented) return;
              const r = Du(n);
              if (!this.isDropAllowed(r)) return;
              this.checkAndUpdatePlaceholderPosition(n);
              const o = Jm(n, this.dndEffectAllowed);
              "none" !== o
                ? (n.preventDefault(),
                  yu(n, o),
                  this.dndDragover.emit(n),
                  this.renderer.addClass(
                    this.elementRef.nativeElement,
                    this.dndDragoverClass
                  ))
                : this.cleanupDragoverState();
            }
            onDrop(n) {
              try {
                const r = Du(n);
                if (!this.isDropAllowed(r)) return;
                const o = (function kA(e, t) {
                  const n = Km(e);
                  return !0 === t
                    ? null !== n && Qm(n)
                      ? JSON.parse(e.dataTransfer?.getData(n) ?? "{}")
                      : {}
                    : null !== n
                    ? JSON.parse(e.dataTransfer?.getData(n) ?? "{}")
                    : {};
                })(n, vu());
                if (!this.isDropAllowed(o.type)) return;
                n.preventDefault();
                const i = Jm(n);
                if ((yu(n, i), "none" === i)) return;
                const s = this.getPlaceholderIndex();
                if (-1 === s) return;
                this.dndDrop.emit({
                  event: n,
                  dropEffect: i,
                  isExternal: vu(),
                  data: o.data,
                  index: s,
                  type: r,
                }),
                  n.stopPropagation();
              } finally {
                this.cleanupDragoverState();
              }
            }
            onDragLeave(n) {
              if (
                (n.preventDefault(),
                n.stopPropagation(),
                null == n._dndDropzoneActive)
              ) {
                const r = document.elementFromPoint(n.clientX, n.clientY);
                if (this.elementRef.nativeElement.contains(r))
                  return void (n._dndDropzoneActive = !0);
              }
              this.cleanupDragoverState(), yu(n, "none");
            }
            isDropAllowed(n) {
              if (this.disabled || (vu() && !this.dndAllowExternal)) return !1;
              if (!this.dndDropzone || !n) return !0;
              if (!Array.isArray(this.dndDropzone))
                throw new Error(
                  "dndDropzone: bound value to [dndDropzone] must be an array!"
                );
              return -1 !== this.dndDropzone.indexOf(n);
            }
            tryGetPlaceholder() {
              return typeof this.dndPlaceholderRef < "u"
                ? this.dndPlaceholderRef.elementRef.nativeElement
                : this.elementRef.nativeElement.querySelector(
                    "[dndPlaceholderRef]"
                  );
            }
            removePlaceholderFromDOM() {
              null !== this.placeholder &&
                null !== this.placeholder.parentNode &&
                this.placeholder.parentNode.removeChild(this.placeholder);
            }
            checkAndUpdatePlaceholderPosition(n) {
              if (null === this.placeholder) return;
              this.placeholder.parentNode !== this.elementRef.nativeElement &&
                this.renderer.appendChild(
                  this.elementRef.nativeElement,
                  this.placeholder
                );
              const r = (function LA(e, t) {
                let n = t;
                for (; n.parentNode !== e; ) {
                  if (!n.parentNode) return null;
                  n = n.parentNode;
                }
                return n;
              })(this.elementRef.nativeElement, n.target);
              null !== r &&
                r !== this.placeholder &&
                ((function VA(e, t, n) {
                  const r = t.getBoundingClientRect();
                  return n
                    ? e.clientX < r.left + r.width / 2
                    : e.clientY < r.top + r.height / 2;
                })(n, r, this.dndHorizontal)
                  ? r.previousSibling !== this.placeholder &&
                    this.renderer.insertBefore(
                      this.elementRef.nativeElement,
                      this.placeholder,
                      r
                    )
                  : r.nextSibling !== this.placeholder &&
                    this.renderer.insertBefore(
                      this.elementRef.nativeElement,
                      this.placeholder,
                      r.nextSibling
                    ));
            }
            getPlaceholderIndex() {
              if (null !== this.placeholder)
                return Array.prototype.indexOf.call(
                  this.elementRef.nativeElement.children,
                  this.placeholder
                );
            }
            cleanupDragoverState() {
              this.renderer.removeClass(
                this.elementRef.nativeElement,
                this.dndDragoverClass
              ),
                this.removePlaceholderFromDOM();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(_e), _($e), _(Bt));
            }),
            (e.ɵdir = T({
              type: e,
              selectors: [["", "dndDropzone", ""]],
              contentQueries: function (n, r, o) {
                if ((1 & n && sg(o, ty, 5), 2 & n)) {
                  let i;
                  ig(
                    (i = (function ag() {
                      return (function a0(e, t) {
                        return e[_t].queries[t].queryList;
                      })(y(), zc());
                    })())
                  ) && (r.dndPlaceholderRef = i.first);
                }
              },
              hostBindings: function (n, r) {
                1 & n &&
                  ee("drop", function (i) {
                    return r.onDrop(i);
                  });
              },
              inputs: {
                dndDropzone: "dndDropzone",
                dndEffectAllowed: "dndEffectAllowed",
                dndAllowExternal: "dndAllowExternal",
                dndHorizontal: "dndHorizontal",
                dndDragoverClass: "dndDragoverClass",
                dndDropzoneDisabledClass: "dndDropzoneDisabledClass",
                dndDisableIf: "dndDisableIf",
                dndDisableDropIf: "dndDisableDropIf",
              },
              outputs: { dndDragover: "dndDragover", dndDrop: "dndDrop" },
            })),
            e
          );
        })(),
        GA = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Pt({ type: e })),
            (e.ɵinj = Dt({ imports: [Em] })),
            e
          );
        })();
      const { isArray: zA } = Array,
        { getPrototypeOf: WA, prototype: qA, keys: ZA } = Object;
      const { isArray: KA } = Array;
      function eT(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      function tT(...e) {
        const t = (function RD(e) {
            return re(fs(e)) ? e.pop() : void 0;
          })(e),
          { args: n, keys: r } = (function YA(e) {
            if (1 === e.length) {
              const t = e[0];
              if (zA(t)) return { args: t, keys: null };
              if (
                (function QA(e) {
                  return e && "object" == typeof e && WA(e) === qA;
                })(t)
              ) {
                const n = ZA(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e),
          o = new Fe((i) => {
            const { length: s } = n;
            if (!s) return void i.complete();
            const a = new Array(s);
            let l = s,
              u = s;
            for (let c = 0; c < s; c++) {
              let d = !1;
              Yt(n[c]).subscribe(
                Dr(
                  i,
                  (f) => {
                    d || ((d = !0), u--), (a[c] = f);
                  },
                  () => l--,
                  void 0,
                  () => {
                    (!l || !d) && (u || i.next(r ? eT(r, a) : a), i.complete());
                  }
                )
              );
            }
          });
        return t
          ? o.pipe(
              (function JA(e) {
                return cs((t) =>
                  (function XA(e, t) {
                    return KA(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(t)
            )
          : o;
      }
      let ny = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Bt), _($e));
            }),
            (e.ɵdir = T({ type: e })),
            e
          );
        })(),
        En = (() => {
          class e extends ny {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (
                  t ||
                  (t = (function Ie(e) {
                    return Xt(() => {
                      const t = e.prototype.constructor,
                        n = t[Nt] || Ws(t),
                        r = Object.prototype;
                      let o = Object.getPrototypeOf(e.prototype).constructor;
                      for (; o && o !== r; ) {
                        const i = o[Nt] || Ws(o);
                        if (i && i !== n) return i;
                        o = Object.getPrototypeOf(o);
                      }
                      return (i) => new i();
                    });
                  })(e))
                )(r || e);
              };
            })()),
            (e.ɵdir = T({ type: e, features: [z] })),
            e
          );
        })();
      const Tt = new F("NgValueAccessor"),
        rT = { provide: Tt, useExisting: Y(() => qi), multi: !0 },
        iT = new F("CompositionEventMode");
      let qi = (() => {
        class e extends ny {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function oT() {
                  const e = dr() ? dr().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(Bt), _($e), _(iT, 8));
          }),
          (e.ɵdir = T({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                ee("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [ne([rT]), z],
          })),
          e
        );
      })();
      const sT = !1,
        Oe = new F("NgValidators"),
        an = new F("NgAsyncValidators");
      function hy(e) {
        return null != e;
      }
      function py(e) {
        const t = pi(e) ? gc(e) : e;
        if (sT && !vh(t)) {
          let n = "Expected async validator to return Promise or Observable.";
          throw (
            ("object" == typeof e &&
              (n +=
                " Are you using a synchronous validator where an async validator is expected?"),
            new C(-1101, n))
          );
        }
        return t;
      }
      function gy(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function my(e, t) {
        return t.map((n) => n(e));
      }
      function yy(e) {
        return e.map((t) =>
          (function lT(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function _u(e) {
        return null != e
          ? (function Dy(e) {
              if (!e) return null;
              const t = e.filter(hy);
              return 0 == t.length
                ? null
                : function (n) {
                    return gy(my(n, t));
                  };
            })(yy(e))
          : null;
      }
      function Cu(e) {
        return null != e
          ? (function vy(e) {
              if (!e) return null;
              const t = e.filter(hy);
              return 0 == t.length
                ? null
                : function (n) {
                    return tT(my(n, t).map(py)).pipe(cs(gy));
                  };
            })(yy(e))
          : null;
      }
      function _y(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function wu(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function Yi(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function Ey(e, t) {
        const n = wu(t);
        return (
          wu(e).forEach((o) => {
            Yi(n, o) || n.push(o);
          }),
          n
        );
      }
      function by(e, t) {
        return wu(t).filter((n) => !Yi(e, n));
      }
      class My {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = _u(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = Cu(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class Ve extends My {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class ln extends My {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class Iy {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let Sy = (() => {
        class e extends Iy {
          constructor(n) {
            super(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(ln, 2));
          }),
          (e.ɵdir = T({
            type: e,
            selectors: [
              ["", "formControlName", ""],
              ["", "ngModel", ""],
              ["", "formControl", ""],
            ],
            hostVars: 14,
            hostBindings: function (n, r) {
              2 & n &&
                dt("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                  "ng-pristine",
                  r.isPristine
                )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                  "ng-invalid",
                  r.isInvalid
                )("ng-pending", r.isPending);
            },
            features: [z],
          })),
          e
        );
      })();
      const co = "VALID",
        Ki = "INVALID",
        fr = "PENDING",
        fo = "DISABLED";
      function Xi(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      class Fy {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(t),
            this._assignAsyncValidators(n);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === co;
        }
        get invalid() {
          return this.status === Ki;
        }
        get pending() {
          return this.status == fr;
        }
        get disabled() {
          return this.status === fo;
        }
        get enabled() {
          return this.status !== fo;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          this._assignValidators(t);
        }
        setAsyncValidators(t) {
          this._assignAsyncValidators(t);
        }
        addValidators(t) {
          this.setValidators(Ey(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(Ey(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(by(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(by(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return Yi(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return Yi(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = fr),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = fo),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = co),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === co || this.status === fr) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? fo : co;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = fr), (this._hasOwnPendingAsyncValidator = !0);
            const n = py(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          let n = t;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, o) => r && r._find(o), this);
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new te()), (this.statusChanges = new te());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? fo
            : this.errors
            ? Ki
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(fr)
            ? fr
            : this._anyControlsHaveStatus(Ki)
            ? Ki
            : co;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          Xi(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
        _assignValidators(t) {
          (this._rawValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedValidatorFn = (function mT(e) {
              return Array.isArray(e) ? _u(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function yT(e) {
              return Array.isArray(e) ? Cu(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      const hr = new F("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Ji,
        }),
        Ji = "always";
      function ho(e, t, n = Ji) {
        (function Tu(e, t) {
          const n = (function Cy(e) {
            return e._rawValidators;
          })(e);
          null !== t.validator
            ? e.setValidators(_y(n, t.validator))
            : "function" == typeof n && e.setValidators([n]);
          const r = (function wy(e) {
            return e._rawAsyncValidators;
          })(e);
          null !== t.asyncValidator
            ? e.setAsyncValidators(_y(r, t.asyncValidator))
            : "function" == typeof r && e.setAsyncValidators([r]);
          const o = () => e.updateValueAndValidity();
          ns(t._rawValidators, o), ns(t._rawAsyncValidators, o);
        })(e, t),
          t.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === n) &&
            t.valueAccessor.setDisabledState?.(e.disabled),
          (function _T(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && Ny(e, t);
            });
          })(e, t),
          (function wT(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function CT(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && Ny(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function vT(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function ns(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function Ny(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function Ry(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function ky(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const Ly = class extends Fy {
          constructor(t = null, n, r) {
            super(
              (function Iu(e) {
                return (Xi(e) ? e.validators : e) || null;
              })(n),
              (function Su(e, t) {
                return (Xi(t) ? t.asyncValidators : e) || null;
              })(r, n)
            ),
              (this.defaultValue = null),
              (this._onChange = []),
              (this._pendingChange = !1),
              this._applyFormState(t),
              this._setUpdateStrategy(n),
              this._initObservables(),
              this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator,
              }),
              Xi(n) &&
                (n.nonNullable || n.initialValueIsDefault) &&
                (this.defaultValue = ky(t) ? t.value : t);
          }
          setValue(t, n = {}) {
            (this.value = this._pendingValue = t),
              this._onChange.length &&
                !1 !== n.emitModelToViewChange &&
                this._onChange.forEach((r) =>
                  r(this.value, !1 !== n.emitViewToModelChange)
                ),
              this.updateValueAndValidity(n);
          }
          patchValue(t, n = {}) {
            this.setValue(t, n);
          }
          reset(t = this.defaultValue, n = {}) {
            this._applyFormState(t),
              this.markAsPristine(n),
              this.markAsUntouched(n),
              this.setValue(this.value, n),
              (this._pendingChange = !1);
          }
          _updateValue() {}
          _anyControls(t) {
            return !1;
          }
          _allControlsDisabled() {
            return this.disabled;
          }
          registerOnChange(t) {
            this._onChange.push(t);
          }
          _unregisterOnChange(t) {
            Ry(this._onChange, t);
          }
          registerOnDisabledChange(t) {
            this._onDisabledChange.push(t);
          }
          _unregisterOnDisabledChange(t) {
            Ry(this._onDisabledChange, t);
          }
          _forEachChild(t) {}
          _syncPendingControls() {
            return !(
              "submit" !== this.updateOn ||
              (this._pendingDirty && this.markAsDirty(),
              this._pendingTouched && this.markAsTouched(),
              !this._pendingChange) ||
              (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1,
              }),
              0)
            );
          }
          _applyFormState(t) {
            ky(t)
              ? ((this.value = this._pendingValue = t.value),
                t.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = t);
          }
        },
        OT = { provide: ln, useExisting: Y(() => xu) },
        jy = (() => Promise.resolve())();
      let xu = (() => {
          class e extends ln {
            constructor(n, r, o, i, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new Ly()),
                (this._registered = !1),
                (this.update = new te()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function Nu(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === qi
                        ? (n = i)
                        : (function MT(e) {
                            return Object.getPrototypeOf(e.constructor) === En;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                (function Fu(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const n = e.model;
                  return !!n.isFirstChange() || !Object.is(t, n.currentValue);
                })(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              ho(this.control, this, this.callSetDisabledState),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              jy.then(() => {
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o =
                  0 !== r &&
                  (function Gl(e) {
                    return "boolean" == typeof e
                      ? e
                      : null != e && "false" !== e;
                  })(r);
              jy.then(() => {
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent
                ? (function es(e, t) {
                    return [...t.path, e];
                  })(n, this._parent)
                : [n];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                _(Ve, 9),
                _(Oe, 10),
                _(an, 10),
                _(Tt, 10),
                _(Yg, 8),
                _(hr, 8)
              );
            }),
            (e.ɵdir = T({
              type: e,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [ne([OT]), z, Rt],
            })),
            e
          );
        })(),
        $y = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Pt({ type: e })),
            (e.ɵinj = Dt({})),
            e
          );
        })(),
        tO = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Pt({ type: e })),
            (e.ɵinj = Dt({ imports: [$y] })),
            e
          );
        })(),
        rO = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: hr, useValue: n.callSetDisabledState ?? Ji },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Pt({ type: e })),
            (e.ɵinj = Dt({ imports: [tO] })),
            e
          );
        })();
      var Ot;
      function oO(e, t) {
        1 & e && Ut(0, "img", 20);
      }
      function iO(e, t) {
        1 & e && Ut(0, "img", 21);
      }
      function sO(e, t) {
        1 & e && Ut(0, "img", 28);
      }
      const aO = function (e, t) {
        return { uncheck: e, check: t };
      };
      function lO(e, t) {
        if (1 & e) {
          const n = (function yh() {
            return y();
          })();
          ie(0, "li", 22),
            ee("dndMoved", function () {
              const o = Os(n),
                i = o.$implicit,
                s = o.index,
                a = nl();
              return Fs(a.onDragged(i, a.tasks, "move", s));
            }),
            ie(1, "div", 23),
            ee("click", function () {
              const i = Os(n).index;
              return Fs(nl().completeTask(i));
            }),
            ie(2, "div"),
            qr(3, sO, 1, 0, "img", 24),
            ye()(),
            ie(4, "p", 25),
            rt(5),
            ye(),
            ie(6, "p", 26),
            Ut(7, "img", 27),
            ye()();
        }
        if (2 & e) {
          const n = t.$implicit;
          $t("dndType", "task")("dndDraggable", n),
            Ue(1),
            $t(
              "ngClass",
              Zp(5, aO, "active" === n.status, "complete" === n.status)
            ),
            Ue(2),
            $t("ngIf", "complete" === n.status),
            Ue(2),
            ll(n.task);
        }
      }
      class go {
        constructor() {
          Object.defineProperty(this, "todo", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: "",
          }),
            Object.defineProperty(this, "currentStatus", {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: "all",
            }),
            Ot.set(this, [
              { task: "Complete online JavaScript course", status: "complete" },
              { task: "Jog around the park 3x", status: "active" },
              { task: "10 minutes meditation", status: "active" },
              { task: "Read for 1 hour", status: "active" },
              { task: "Pick up groceries", status: "active" },
              {
                task: "Complete Todo App on Frontend Mentor",
                status: "active",
              },
            ]),
            Object.defineProperty(this, "mode", {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: "dark",
            }),
            Object.defineProperty(this, "tasks", {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: [],
            });
        }
        addTodo() {
          console.log("adding   ....");
          const t = this.todo.trim();
          (this.todo = ""),
            t &&
              (this.tasks.push({ task: t, status: "active" }),
              Mn(this, Ot, "f").push({ task: t, status: "active" }));
        }
        ngOnInit() {
          this.tasks = [...Mn(this, Ot, "f")];
        }
        swithModes() {
          this.mode = "light" === this.mode ? "dark" : "light";
        }
        filterTasks(t) {
          (this.currentStatus = t),
            (this.tasks =
              "all" === t
                ? [...Mn(this, Ot, "f")]
                : Mn(this, Ot, "f").filter((n) => n.status === t));
        }
        completeTask(t) {
          console.log("index", t);
          const n = this.tasks[t],
            r = Mn(this, Ot, "f").findIndex((o) => o.task === n.task);
          (n.status = "complete" !== n.status ? "complete" : "active"),
            (this.tasks[t] = n),
            (Mn(this, Ot, "f")[r] = n);
        }
        onDrop(t, n) {
          console.log("on drop ==>", t);
          let r = t.index;
          typeof r > "u" && (r = n.length),
            n.splice(r, 0, t.data),
            Ju(this, Ot, [...this.tasks], "f");
        }
        onDragged(t, n, r, o) {
          console.log("ON DRAGGED ==>", r, o);
          const i = n.indexOf(t);
          n.splice(i, 1);
        }
        clearCompleted() {
          (this.tasks = this.tasks.filter((t) => "active" === t.status)),
            Ju(this, Ot, [...this.tasks], "f");
        }
      }
      (Ot = new WeakMap()),
        Object.defineProperty(go, "\u0275fac", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: function (t) {
            return new (t || go)();
          },
        }),
        Object.defineProperty(go, "\u0275cmp", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: bs({
            type: go,
            selectors: [["app-root"]],
            decls: 37,
            vars: 18,
            consts: [
              [1, "container"],
              [1, "top-section"],
              [1, "middle-section"],
              [1, "main-section"],
              [1, "todo-header"],
              [3, "click"],
              [
                "style",
                "height: 32px",
                "src",
                "assets/icon-moon.svg",
                "alt",
                "",
                "class",
                "todo_icon-img",
                4,
                "ngIf",
              ],
              [
                "class",
                "todo_icon-img",
                "style",
                "height: 32px",
                "src",
                "assets/icon-sun.svg",
                "alt",
                "",
                4,
                "ngIf",
              ],
              [1, "create--todo-box"],
              [1, "rounded-circle"],
              [
                "type",
                "text",
                "placeholder",
                "Create a new todo",
                3,
                "ngModel",
                "ngModelChange",
                "keyup.enter",
              ],
              [
                "dndDropzone",
                "",
                "dndEffectAllowed",
                "move",
                1,
                "todo--list",
                "scroll",
                3,
                "dndDrop",
              ],
              ["dndPlaceholderRef", "", 1, "dndPlaceholder"],
              [
                "class",
                "todo-item",
                "dndEffectAllowed",
                "move",
                3,
                "dndType",
                "dndDraggable",
                "dndMoved",
                4,
                "ngFor",
                "ngForOf",
              ],
              [1, "todo--options"],
              [1, "todo--options-left"],
              [1, "todo--options-statuses", "mobile"],
              [1, "todo--options-clear", 3, "click"],
              [1, "mobile_statuses"],
              [1, "last-text"],
              [
                "src",
                "assets/icon-moon.svg",
                "alt",
                "",
                1,
                "todo_icon-img",
                2,
                "height",
                "32px",
              ],
              [
                "src",
                "assets/icon-sun.svg",
                "alt",
                "",
                1,
                "todo_icon-img",
                2,
                "height",
                "32px",
              ],
              [
                "dndEffectAllowed",
                "move",
                1,
                "todo-item",
                3,
                "dndType",
                "dndDraggable",
                "dndMoved",
              ],
              [1, "check_status", 3, "ngClass", "click"],
              ["src", "assets/icon-check.svg", "alt", "", 4, "ngIf"],
              [1, "task"],
              [1, "todo_del"],
              ["src", "assets/icon-cross.svg", "alt", ""],
              ["src", "assets/icon-check.svg", "alt", ""],
            ],
            template: function (t, n) {
              1 & t &&
                (ie(0, "div", 0),
                Ut(1, "section", 1)(2, "section", 2),
                ie(3, "section", 3)(4, "div", 4)(5, "h1"),
                rt(6, "TODO"),
                ye(),
                ie(7, "h1", 5),
                ee("click", function () {
                  return n.swithModes();
                }),
                qr(8, oO, 1, 0, "img", 6),
                qr(9, iO, 1, 0, "img", 7),
                ye()(),
                ie(10, "div", 8),
                Ut(11, "span", 9),
                ie(12, "input", 10),
                ee("ngModelChange", function (o) {
                  return (n.todo = o);
                })("keyup.enter", function () {
                  return n.addTodo();
                }),
                ye()(),
                ie(13, "ul", 11),
                ee("dndDrop", function (o) {
                  return n.onDrop(o, n.tasks);
                }),
                Ut(14, "li", 12),
                qr(15, lO, 8, 8, "li", 13),
                ye(),
                ie(16, "div", 14)(17, "p", 15),
                rt(18, "5 items left"),
                ye(),
                ie(19, "div", 16)(20, "p", 5),
                ee("click", function () {
                  return n.filterTasks("all");
                }),
                rt(21, " All "),
                ye(),
                ie(22, "p", 5),
                ee("click", function () {
                  return n.filterTasks("active");
                }),
                rt(23, " Active "),
                ye(),
                ie(24, "p", 5),
                ee("click", function () {
                  return n.filterTasks("complete");
                }),
                rt(25, " Completed "),
                ye()(),
                ie(26, "p", 17),
                ee("click", function () {
                  return n.clearCompleted();
                }),
                rt(27, " Clear Completed "),
                ye()(),
                ie(28, "div", 18)(29, "p", 5),
                ee("click", function () {
                  return n.filterTasks("all");
                }),
                rt(30, " All "),
                ye(),
                ie(31, "p", 5),
                ee("click", function () {
                  return n.filterTasks("active");
                }),
                rt(32, " Active "),
                ye(),
                ie(33, "p", 5),
                ee("click", function () {
                  return n.filterTasks("complete");
                }),
                rt(34, " Completed "),
                ye()(),
                ie(35, "p", 19),
                rt(36, "Drag and drop to reorder list"),
                ye()()()),
                2 & t &&
                  (dt("dark_mode", "dark" === n.mode),
                  Ue(8),
                  $t("ngIf", "light" === n.mode),
                  Ue(1),
                  $t("ngIf", "dark" === n.mode),
                  Ue(3),
                  $t("ngModel", n.todo),
                  Ue(3),
                  $t("ngForOf", n.tasks),
                  Ue(5),
                  dt("todo--options-activeStatus", "all" === n.currentStatus),
                  Ue(2),
                  dt(
                    "todo--options-activeStatus",
                    "active" === n.currentStatus
                  ),
                  Ue(2),
                  dt(
                    "todo--options-activeStatus",
                    "complete" === n.currentStatus
                  ),
                  Ue(5),
                  dt("todo--options-activeStatus", "all" === n.currentStatus),
                  Ue(2),
                  dt(
                    "todo--options-activeStatus",
                    "active" === n.currentStatus
                  ),
                  Ue(2),
                  dt(
                    "todo--options-activeStatus",
                    "complete" === n.currentStatus
                  ));
            },
            dependencies: [pm, ym, vm, $A, UA, ty, qi, Sy, xu],
            styles: [
              ".container[_ngcontent-%COMP%]{position:relative;padding-bottom:2.4rem;color:var(--Dark-Grayish-Blue-Light);background-color:var(--Very-Light-Gray-Light)}.dark_mode.container[_ngcontent-%COMP%]{color:var(--Light-Grayish-Blue-Dark);background-color:var(--Very-Dark-Blue-Dark)}.top-section[_ngcontent-%COMP%]{background:url(bg-desktop-light.c2b0ff8fcc1f6c0b.jpg) no-repeat;background-size:cover;min-height:33rem}.dark_mode[_ngcontent-%COMP%]   .top-section[_ngcontent-%COMP%]{background-image:url(bg-desktop-dark.b69c129621b067f4.jpg)}.middle-section[_ngcontent-%COMP%]{min-height:70rem}.last-text[_ngcontent-%COMP%]{text-align:center;font-size:1.8rem;margin-top:6rem}.todo-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:4rem;font-size:2.8rem;letter-spacing:1rem;color:var(--Very-Light-Gray-Light);font-weight:400}.todo_icon--img[_ngcontent-%COMP%]{height:3.2rem}.dark_mode[_ngcontent-%COMP%]   .todo_icon-img[_ngcontent-%COMP%]{height:2.4rem}.dark_mode[_ngcontent-%COMP%]   .todo-header[_ngcontent-%COMP%]{color:#e4e5f1}.main-section[_ngcontent-%COMP%]{position:absolute;top:10%;left:50%;width:35vw;transform:translate(-50%);display:flex;flex-direction:column}.create--todo-box[_ngcontent-%COMP%]{position:relative}.dark_mode[_ngcontent-%COMP%]   .create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark_mode[_ngcontent-%COMP%]   .todo--list[_ngcontent-%COMP%], .dark_mode[_ngcontent-%COMP%]   .todo--options[_ngcontent-%COMP%], .dark_mode[_ngcontent-%COMP%]   .mobile_statuses[_ngcontent-%COMP%]{background-color:var(--Very-Dark-Desaturated-Blue-Dark)}.rounded-circle[_ngcontent-%COMP%]{height:2.4rem;width:2.4rem;position:absolute;border:1px solid var(--Light-Grayish-Blue-Dark);top:50%;left:3%;transform:translateY(-50%);border-radius:50%}.dark_mode[_ngcontent-%COMP%]   .rounded-circle[_ngcontent-%COMP%]{border-color:var(--Dark-Grayish-Blue-Medium-Dark)}.create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;box-shadow:0 5px 2px #0000001a}.create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder{font-weight:400;font-family:inherit;font-size:24px;text-align:start;color:var(--Dark-Grayish-Blue-Light)}.create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{border-radius:.6rem;width:100%;border:none;height:7rem;color:var(--Light-Grayish-Blue-Dark);padding-left:10%}.todo--list[_ngcontent-%COMP%]{list-style-type:none;border-radius:.6rem .6rem 0 0;margin-top:3rem;max-height:40rem;z-index:9;overflow-y:auto;background-color:#fff;position:relative;box-shadow:0 0 4.8rem #0000001a;clip-path:inset(0px -4.8rem 0px -4.8rem)}.todo-item[_ngcontent-%COMP%]{font-size:1.8rem;font-weight:700;padding:2.4rem;display:flex;align-items:center;justify-content:unset;border-bottom:.1rem var(--Very-Light-Grayish-Blue-Light) solid}.dark_mode[_ngcontent-%COMP%]   .todo-item[_ngcontent-%COMP%]{color:#777a92;border-bottom:.01px hsl(234,11%,52%) solid}.check_status[_ngcontent-%COMP%]{margin-right:1.6rem;flex:0 0 auto;border-radius:50%;height:2.4rem;width:2.4rem;display:flex;justify-content:center;align-items:center}.uncheck[_ngcontent-%COMP%]{border:1px solid var(--Light-Grayish-Blue-Dark)}.dark_mode[_ngcontent-%COMP%]   .uncheck[_ngcontent-%COMP%]{border:.5px solid hsl(235,14%,35%)}.dark_mode[_ngcontent-%COMP%]   .uncheck[_ngcontent-%COMP%]:hover{border:none}.dark_mode[_ngcontent-%COMP%]   .uncheck[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{visibility:hidden}.check[_ngcontent-%COMP%]{border:none;color:#d2d3db;background-image:linear-gradient(to right bottom,hsl(192,100%,67%),hsl(280,87%,65%))}.check_status[_ngcontent-%COMP%] + .task[_ngcontent-%COMP%]{flex:1 1 100%}.check[_ngcontent-%COMP%] + .task[_ngcontent-%COMP%]{text-decoration:line-through;color:var(--Light-Grayish-Blue-Light)}.dark_mode[_ngcontent-%COMP%]   .task[_ngcontent-%COMP%]{color:var(--Light-Grayish-Blue-Dark)!important}.dark_mode[_ngcontent-%COMP%]   .task[_ngcontent-%COMP%]:hover{color:var(--Light-Grayish-Blue-hover-Dark)!important}.uncheck[_ngcontent-%COMP%] + .task[_ngcontent-%COMP%]:hover + .todo_del[_ngcontent-%COMP%]{display:block}.uncheck[_ngcontent-%COMP%]:hover{border:none;cursor:pointer;background-image:linear-gradient(to right bottom,hsl(192,100%,67%),hsl(280,87%,65%))}.dark_mode[_ngcontent-%COMP%]   .check_status.uncheck[_ngcontent-%COMP%]:hover > div[_ngcontent-%COMP%]{visibility:visible;background:hsl(235,24%,19%)}.uncheck[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{height:2rem;width:2rem;border-radius:50%;background-color:#fff}.uncheck[_ngcontent-%COMP%]:hover   div[_ngcontent-%COMP%]{background-color:#fff}.todo_del[_ngcontent-%COMP%]{flex:1 1 auto;width:4rem;display:none}.todo_del[_ngcontent-%COMP%]:hover{display:block}.display-none[_ngcontent-%COMP%]{display:none}.todo--options[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;font-weight:500;border-radius:0 0 .6rem .6rem;padding:2.4rem;box-shadow:0 3rem 4.8rem #0000001a}.todo--options-left[_ngcontent-%COMP%], .todo--options-clear[_ngcontent-%COMP%]{font-size:1.6rem}.todo--options-statuses[_ngcontent-%COMP%]{display:flex;justify-content:space-between;width:18rem;font-size:1.8rem}.uncheck[_ngcontent-%COMP%] + .task[_ngcontent-%COMP%]:hover, .todo--options[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]:hover, .todo--options-statuses[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]:hover{color:var(--Very-Dark-Grayish-Blue-Light);cursor:pointer}.todo--options-activeStatus[_ngcontent-%COMP%]{color:var(--Bright-Blue)}.dark_mode[_ngcontent-%COMP%]   .todo--options-left[_ngcontent-%COMP%], .dark_mode[_ngcontent-%COMP%]   .todo--options-statuses[_ngcontent-%COMP%], .dark_mode[_ngcontent-%COMP%]   .last-text[_ngcontent-%COMP%], .dark_mode[_ngcontent-%COMP%]   .todo--options-clear[_ngcontent-%COMP%]{color:var(--Dark-Grayish-Blue-Light-Dark)}.dark_mode[_ngcontent-%COMP%]   .todo--options-left[_ngcontent-%COMP%]:hover, .dark_mode[_ngcontent-%COMP%]   .todo--options-statuses[_ngcontent-%COMP%]:hover, .dark_mode[_ngcontent-%COMP%]   .last-text[_ngcontent-%COMP%]:hover, .dark_mode[_ngcontent-%COMP%]   .todo--options-clear[_ngcontent-%COMP%]:hover{color:var(--Light-Grayish-Blue-Dark)}.mobile_statuses[_ngcontent-%COMP%]{display:none}@media (max-width: 375px){.main-section[_ngcontent-%COMP%]{width:90vw;top:6%}.top-section[_ngcontent-%COMP%]{min-height:32vh}.middle-section[_ngcontent-%COMP%]{min-height:68vh}.todo-header[_ngcontent-%COMP%]{font-size:2rem;margin-bottom:2.4rem}.rounded-circle[_ngcontent-%COMP%]{height:1.8rem;width:1.8rem;left:6%}.create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder{font-size:16px;text-align:start;color:var(--Dark-Grayish-Blue-Light)}.create--todo-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{border-radius:.5rem;height:5rem;padding-left:15%}.todo--options-statuses.mobile[_ngcontent-%COMP%]{display:none}.todo--list[_ngcontent-%COMP%]{margin-top:1.6rem;min-height:40vh}.todo-item[_ngcontent-%COMP%]{font-size:1.2rem;padding:1.4rem}.check[_ngcontent-%COMP%]{padding-top:.4rem}.check_status[_ngcontent-%COMP%]{margin-right:1rem;height:1.8rem;width:1.8rem}.uncheck[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{height:1.6rem;width:1.6rem}.uncheck[_ngcontent-%COMP%] + .task[_ngcontent-%COMP%] + .todo_del[_ngcontent-%COMP%]{margin-left:.4rem;width:2.4rem;display:block}.mobile_statuses[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-around;padding:1.6rem 6.4rem;font-size:1.8rem;margin-top:1.8rem;background-color:#fff;border-radius:.6rem;box-shadow:0 2rem 2rem #0000001a}.dark_mode[_ngcontent-%COMP%]   .mobile_statuses[_ngcontent-%COMP%]{color:var(--Dark-Grayish-Blue-Light-Dark)}.last-text[_ngcontent-%COMP%]{margin-top:2.4rem}}.scroll[_ngcontent-%COMP%]::-webkit-scrollbar{width:12px}.scroll[_ngcontent-%COMP%]::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);-webkit-box-shadow:inset 0 0 6px var(--Very-Dark-Desaturated-Blue-Dark);border-radius:10px}.scroll[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.5)}",
            ],
          }),
        });
      class pr {}
      Object.defineProperty(pr, "\u0275fac", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: function (t) {
          return new (t || pr)();
        },
      }),
        Object.defineProperty(pr, "\u0275mod", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: Pt({ type: pr, bootstrap: [go] }),
        }),
        Object.defineProperty(pr, "\u0275inj", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: Dt({ imports: [MA, GA, rO] }),
        }),
        bA()
          .bootstrapModule(pr)
          .catch((e) => console.error(e));
    },
  },
  (re) => {
    re((re.s = 755));
  },
]);
