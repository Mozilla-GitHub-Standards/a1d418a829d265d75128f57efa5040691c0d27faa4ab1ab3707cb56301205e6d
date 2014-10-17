(function() {
  var a = [].indexOf || function(c) {
      for (var d = 0, f = this.length; d < f; d++) {
        if (d in this && this[d] === c) {
          return d
        }
      }
      return -1
    }, b = [].slice;
  (function(c, d) {
    if (typeof define === "function" && define.amd) {
      return define("waypoints", ["jquery"], function(e) {
        return d(e, c)
      })
    } else {
      return d(c.jQuery, c)
    }
  })(this, function(B, x) {
      var E, A, D, t, H, q, K, J, F, I, z, e, k, j, G, C;
      E = B(x);
      J = a.call(x, "ontouchstart") >= 0;
      t = {
        horizontal: {},
        vertical: {}
      };
      H = 1;
      K = {};
      q = "waypoints-context-id";
      z = "resize.waypoints";
      e = "scroll.waypoints";
      k = 1;
      j = "waypoints-waypoint-ids";
      G = "waypoint";
      C = "waypoints";
      A = function() {
        function c(d) {
          var f = this;
          this.$element = d;
          this.element = d[0];
          this.didResize = false;
          this.didScroll = false;
          this.id = "context" + H++;
          this.oldScroll = {
            x: d.scrollLeft(),
            y: d.scrollTop()
          };
          this.waypoints = {
            horizontal: {},
            vertical: {}
          };
          d.data(q, this.id);
          K[this.id] = this;
          d.bind(e, function() {
            var g;
            if (!(f.didScroll || J)) {
              f.didScroll = true;
              g = function() {
                f.doScroll();
                return f.didScroll = false
              };
              return x.setTimeout(g, B[C].settings.scrollThrottle)
            }
          });
          d.bind(z, function() {
            var g;
            if (!f.didResize) {
              f.didResize = true;
              g = function() {
                B[C]("refresh");
                return f.didResize = false
              };
              return x.setTimeout(g, B[C].settings.resizeThrottle)
            }
          })
        }
        c.prototype.doScroll = function() {
          var d, f = this;
          d = {
            horizontal: {
              newScroll: this.$element.scrollLeft(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left"
            },
            vertical: {
              newScroll: this.$element.scrollTop(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up"
            }
          };
          if (J && (!d.vertical.oldScroll || !d.vertical.newScroll)) {
            B[C]("refresh")
          }
          B.each(d, function(m, n) {
            var h, p, g;
            g = [];
            p = n.newScroll > n.oldScroll;
            h = p ? n.forward : n.backward;
            B.each(f.waypoints[m], function(o, r) {
              var s, l;
              if (n.oldScroll < (s = r.offset) && s <= n.newScroll) {
                return g.push(r)
              } else {
                if (n.newScroll < (l = r.offset) && l <= n.oldScroll) {
                  return g.push(r)
                }
              }
            });
            g.sort(function(i, l) {
              return i.offset - l.offset
            });
            if (!p) {
              g.reverse()
            }
            return B.each(g, function(i, l) {
              if (l.options.continuous || i === g.length - 1) {
                return l.trigger([h])
              }
            })
          });
          return this.oldScroll = {
            x: d.horizontal.newScroll,
            y: d.vertical.newScroll
          }
        };
        c.prototype.refresh = function() {
          var f, h, g, d = this;
          g = B.isWindow(this.element);
          h = this.$element.offset();
          this.doScroll();
          f = {
            horizontal: {
              contextOffset: g ? 0 : h.left,
              contextScroll: g ? 0 : this.oldScroll.x,
              contextDimension: this.$element.width(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
              offsetProp: "left"
            },
            vertical: {
              contextOffset: g ? 0 : h.top,
              contextScroll: g ? 0 : this.oldScroll.y,
              contextDimension: g ? B[C]("viewportHeight") : this.$element.height(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
              offsetProp: "top"
            }
          };
          return B.each(f, function(i, l) {
            return B.each(d.waypoints[i], function(p, v) {
              var n, y, m, u, w;
              n = v.options.offset;
              m = v.offset;
              y = B.isWindow(v.element) ? 0 : v.$element.offset()[l.offsetProp];
              if (B.isFunction(n)) {
                n = n.apply(v.element)
              } else {
                if (typeof n === "string") {
                  n = parseFloat(n);
                  if (v.options.offset.indexOf("%") > -1) {
                    n = Math.ceil(l.contextDimension * n / 100)
                  }
                }
              }
              v.offset = y - l.contextOffset + l.contextScroll - n;
              if (v.options.onlyOnScroll && m != null || !v.enabled) {
                return
              }
              if (m !== null && m < (u = l.oldScroll) && u <= v.offset) {
                return v.trigger([l.backward])
              } else {
                if (m !== null && m > (w = l.oldScroll) && w >= v.offset) {
                  return v.trigger([l.forward])
                } else {
                  if (m === null && l.oldScroll >= v.offset) {
                    return v.trigger([l.forward])
                  }
                }
              }
            })
          })
        };
        c.prototype.checkEmpty = function() {
          if (B.isEmptyObject(this.waypoints.horizontal) && B.isEmptyObject(this.waypoints.vertical)) {
            this.$element.unbind([z, e].join(" "));
            return delete K[this.id]
          }
        };
        return c
      }();
      D = function() {
        function c(f, h, g) {
          var d, l;
          g = B.extend({}, B.fn[G].defaults, g);
          if (g.offset === "bottom-in-view") {
            g.offset = function() {
              var i;
              i = B[C]("viewportHeight");
              if (!B.isWindow(h.element)) {
                i = h.$element.height()
              }
              return i - B(this).outerHeight()
            }
          }
          this.$element = f;
          this.element = f[0];
          this.axis = g.horizontal ? "horizontal" : "vertical";
          this.callback = g.handler;
          this.context = h;
          this.enabled = g.enabled;
          this.id = "waypoints" + k++;
          this.offset = null;
          this.options = g;
          h.waypoints[this.axis][this.id] = this;
          t[this.axis][this.id] = this;
          d = (l = f.data(j)) != null ? l : [];
          d.push(this.id);
          f.data(j, d)
        }
        c.prototype.trigger = function(d) {
          if (!this.enabled) {
            return
          }
          if (this.callback != null) {
            this.callback.apply(this.element, d)
          }
          if (this.options.triggerOnce) {
            return this.destroy()
          }
        };
        c.prototype.disable = function() {
          return this.enabled = false
        };
        c.prototype.enable = function() {
          this.context.refresh();
          return this.enabled = true
        };
        c.prototype.destroy = function() {
          delete t[this.axis][this.id];
          delete this.context.waypoints[this.axis][this.id];
          return this.context.checkEmpty()
        };
        c.getWaypointsByElement = function(d) {
          var g, f;
          f = B(d).data(j);
          if (!f) {
            return []
          }
          g = B.extend({}, t.horizontal, t.vertical);
          return B.map(f, function(h) {
            return g[h]
          })
        };
        return c
      }();
      I = {
        init: function(c, f) {
          var d;
          if (f == null) {
            f = {}
          }
          if ((d = f.handler) == null) {
            f.handler = c
          }
          this.each(function() {
            var h, m, g, l;
            h = B(this);
            g = (l = f.context) != null ? l : B.fn[G].defaults.context;
            if (!B.isWindow(g)) {
              g = h.closest(g)
            }
            g = B(g);
            m = K[g.data(q)];
            if (!m) {
              m = new A(g)
            }
            return new D(h, m, f)
          });
          B[C]("refresh");
          return this
        },
        disable: function() {
          return I._invoke(this, "disable")
        },
        enable: function() {
          return I._invoke(this, "enable")
        },
        destroy: function() {
          return I._invoke(this, "destroy")
        },
        prev: function(c, d) {
          return I._traverse.call(this, c, d, function(f, g, h) {
            if (g > 0) {
              return f.push(h[g - 1])
            }
          })
        },
        next: function(c, d) {
          return I._traverse.call(this, c, d, function(f, g, h) {
            if (g < h.length - 1) {
              return f.push(h[g + 1])
            }
          })
        },
        _traverse: function(f, g, d) {
          var h, c;
          if (f == null) {
            f = "vertical"
          }
          if (g == null) {
            g = x
          }
          c = F.aggregate(g);
          h = [];
          this.each(function() {
            var i;
            i = B.inArray(this, c[f]);
            return d(h, i, c[f])
          });
          return this.pushStack(h)
        },
        _invoke: function(c, d) {
          c.each(function() {
            var f;
            f = D.getWaypointsByElement(this);
            return B.each(f, function(g, h) {
              h[d]();
              return true
            })
          });
          return this
        }
      };
      B.fn[G] = function() {
        var c, d;
        d = arguments[0], c = 2 <= arguments.length ? b.call(arguments, 1) : [];
        if (I[d]) {
          return I[d].apply(this, c)
        } else {
          if (B.isFunction(d)) {
            return I.init.apply(this, arguments)
          } else {
            if (B.isPlainObject(d)) {
              return I.init.apply(this, [null, d])
            } else {
              if (!d) {
                return B.error("jQuery Waypoints needs a callback function or handler option.")
              } else {
                return B.error("The " + d + " method does not exist in jQuery Waypoints.")
              }
            }
          }
        }
      };
      B.fn[G].defaults = {
        context: x,
        continuous: true,
        enabled: true,
        horizontal: false,
        offset: 0,
        triggerOnce: false
      };
      F = {
        refresh: function() {
          return B.each(K, function(c, d) {
            return d.refresh()
          })
        },
        viewportHeight: function() {
          var c;
          return (c = x.innerHeight) != null ? c : E.height()
        },
        aggregate: function(d) {
          var g, f, c;
          g = t;
          if (d) {
            g = (c = K[B(d).data(q)]) != null ? c.waypoints : void 0
          }
          if (!g) {
            return []
          }
          f = {
            horizontal: [],
            vertical: []
          };
          B.each(f, function(l, h) {
            B.each(g[l], function(i, m) {
              return h.push(m)
            });
            h.sort(function(i, m) {
              return i.offset - m.offset
            });
            f[l] = B.map(h, function(i) {
              return i.element
            });
            return f[l] = B.unique(f[l])
          });
          return f
        },
        above: function(c) {
          if (c == null) {
            c = x
          }
          return F._filter(c, "vertical", function(d, f) {
            return f.offset <= d.oldScroll.y
          })
        },
        below: function(c) {
          if (c == null) {
            c = x
          }
          return F._filter(c, "vertical", function(d, f) {
            return f.offset > d.oldScroll.y
          })
        },
        left: function(c) {
          if (c == null) {
            c = x
          }
          return F._filter(c, "horizontal", function(d, f) {
            return f.offset <= d.oldScroll.x
          })
        },
        right: function(c) {
          if (c == null) {
            c = x
          }
          return F._filter(c, "horizontal", function(d, f) {
            return f.offset > d.oldScroll.x
          })
        },
        enable: function() {
          return F._invoke("enable")
        },
        disable: function() {
          return F._invoke("disable")
        },
        destroy: function() {
          return F._invoke("destroy")
        },
        extendFn: function(c, d) {
          return I[c] = d
        },
        _invoke: function(c) {
          var d;
          d = B.extend({}, t.vertical, t.horizontal);
          return B.each(d, function(f, g) {
            g[c]();
            return true
          })
        },
        _filter: function(d, g, f) {
          var c, h;
          c = K[B(d).data(q)];
          if (!c) {
            return []
          }
          h = [];
          B.each(c.waypoints[g], function(i, l) {
            if (f(c, l)) {
              return h.push(l)
            }
          });
          h.sort(function(i, l) {
            return i.offset - l.offset
          });
          return B.map(h, function(i) {
            return i.element
          })
        }
      };
      B[C] = function() {
        var c, d;
        d = arguments[0], c = 2 <= arguments.length ? b.call(arguments, 1) : [];
        if (F[d]) {
          return F[d].apply(null, c)
        } else {
          return F.aggregate.call(null, d)
        }
      };
      B[C].settings = {
        resizeThrottle: 100,
        scrollThrottle: 30
      };
      return E.load(function() {
        return B[C]("refresh")
      })
    })
}).call(this);
$(function() {
  var b = $(".promo-grid");
  var a = $(".promo-grid .item");

  function d() {
    var g = $(".firefox-download");
    g.on("mouseenter focusin", function() {
      g.addClass("show")
    });
    g.on("mouseleave focusout", function() {
      g.removeClass("show")
    });
    $(".firefox-download .download-other-desktop").show()
  }
  d();

  function f() {
    var h = $(".promo-large-landscape, .promo-large-portrait");
    var g;
    var i;
    h.on("mousemove", function() {
      var j = $(this);
      if (!b.hasClass("scroll") && !j.hasClass("show")) {
        j.addClass("show");
        clearTimeout(i);
        i = setTimeout(function() {}, 600)
      }
    });
    h.on("mouseleave", function() {
      var j = $(this);
      if (j.hasClass("show")) {
        j.removeClass("show")
      }
    });
    h.on("click focus", function(k) {
      var j = $(this);
      if (!j.hasClass("show")) {
        k.preventDefault();
        j.addClass("show")
      }
    });
    $(".promo-large-landscape > a, .promo-large-portrait > a").on("blur", function() {
      var j = $(this);
      if (j.parent().hasClass("show")) {
        j.parent().removeClass("show")
      }
    });
    $(window).on("scroll", function() {
      clearTimeout(g);
      if (!b.hasClass("scroll")) {
        b.addClass("scroll")
      }
      g = setTimeout(function() {
        b.removeClass("scroll")
      }, 200)
    })
  }

  function c() {
    b.addClass("stagger reveal");
    setTimeout(function() {
      b.removeClass("stagger")
    }, 50)
  }

  function e() {
    var g = $("#twt-body");
    if (g.length > 0 && (g[0].scrollHeight > g.innerHeight())) {
      g.find(".ellipsis").show()
    }
  }
  e();
  c();
  f()
});
if (typeof Mozilla == "undefined") {
  var Mozilla = {}
}
$(function() {
  if (typeof Mozilla.Homepage == "undefined") {
    Mozilla.Homepage = {}
  }
  var f = $(window);
  var d = $("#scroll-prompt");
  var b = $(".promo-grid");
  var a;

  function c() {
    clearTimeout(a);
    f.off("scroll.prompt", scroll);
    d.off("click", e);
    d.stop().fadeOut()
  }

  function e() {
    c();
    $("html, body").animate({
      scrollTop: b.offset().top + 302
    }, 1000)
  }

  function g() {
    var i = f.innerWidth();
    var h = (i > 660) && (i <= 1300);
    if (h && !f.scrollTop() > 0) {
      a = setTimeout(function() {
        if (!f.scrollTop() > 0) {
          d.fadeIn();
          d.on("click", e);
          f.one("scroll.prompt", c)
        }
      }, 4000)
    }
  }
  Mozilla.Homepage.initScrollPrompt = g
});
