(function() {
  (function($) {
    $.fn.bootstrapSwitch = function(method) {
      var methods;
      methods = {
        init: function() {
          return this.each(function() {
            var $div, $element, $form, $label, $switchLeft, $switchRight, $wrapper, changeStatus;
            $element = $(this);
            $switchLeft = $("<span>", {
              "class": "switch-left",
              html: function() {
                var html, label;
                html = "ON";
                label = $element.data("on-label");
                if (typeof label !== "undefined") {
                  html = label;
                }
                return html;
              }
            });
            $switchRight = $("<span>", {
              "class": "switch-right",
              html: function() {
                var html, label;
                html = "OFF";
                label = $element.data("off-label");
                if (typeof label !== "undefined") {
                  html = label;
                }
                return html;
              }
            });
            $label = $("<label>", {
              "for": $element.attr("id"),
              html: function() {
                var html, icon, label;
                html = "&nbsp;";
                icon = $element.data("label-icon");
                label = $element.data("text-label");
                if (typeof icon !== "undefined") {
                  html = "<i class=\"icon " + icon + "\"></i>";
                }
                if (typeof label !== "undefined") {
                  html = label;
                }
                return html;
              }
            });
            $div = $("<div>");
            $wrapper = $("<div>", {
              "class": "has-switch"
            });
            $form = $element.closest("form");
            changeStatus = function() {
              if (!$label.hasClass("label-change-switch")) {
                return $label.trigger("mousedown").trigger("mouseup").trigger("click");
              }
            };
            $element.data("bootstrap-switch", true);
            if ($element.attr("class")) {
              $.each(["switch-mini", "switch-small", "switch-large"], function(i, cls) {
                if ($element.attr("class").indexOf(cls) >= 0) {
                  $switchLeft.addClass(cls);
                  $label.addClass(cls);
                  return $switchRight.addClass(cls);
                }
              });
            }
            if ($element.data("on") !== undefined) {
              $switchLeft.addClass("switch-" + $element.data("on"));
            }
            if ($element.data("off") !== undefined) {
              $switchRight.addClass("switch-" + $element.data("off"));
            }
            $div.data("animated", false);
            if ($element.data("animated") !== false) {
              $div.addClass("switch-animate").data("animated", true);
            }
            $div = $element.wrap($div).parent();
            $wrapper = $div.wrap($wrapper).parent();
            $element.before($switchLeft).before($label).before($switchRight);
            $div.addClass($element.is(":checked") ? "switch-on" : "switch-off");
            if ($element.is(":disabled")) {
              $wrapper.addClass("deactivate");
            }
            $element.on("keydown", function(e) {
              if (e.keyCode !== 32) {
                return;
              }
              e.stopImmediatePropagation();
              e.preventDefault();
              return changeStatus($(e.target).find("span:first"));
            }).on("change", function(e, skip) {
              var isChecked, state;
              isChecked = $element.is(":checked");
              state = $div.is(".switch-off");
              e.preventDefault();
              $div.css("left", "");
              if (state !== isChecked) {
                return;
              }
              if (isChecked) {
                $div.removeClass("switch-off").addClass("switch-on");
              } else {
                $div.removeClass("switch-on").addClass("switch-off");
              }
              if ($div.data("animated") !== false) {
                $div.addClass("switch-animate");
              }
              if (typeof skip === "boolean" && skip) {
                return;
              }
              return $element.trigger("switch-change", {
                el: $element,
                value: isChecked
              });
            });
            $switchLeft.on("click", function() {
              return changeStatus();
            });
            $switchRight.on("click", function() {
              return changeStatus();
            });
            $label.on("mousedown touchstart", function(e) {
              var moving;
              moving = false;
              e.preventDefault();
              e.stopImmediatePropagation();
              $div.removeClass("switch-animate");
              if ($element.is(":disabled") || $element.hasClass("radio-no-uncheck")) {
                return $label.unbind("click");
              }
              return $label.on("mousemove touchmove", function(e) {
                var left, percent, relativeX, right;
                relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $wrapper.offset().left;
                percent = (relativeX / $wrapper.width()) * 100;
                left = 25;
                right = 75;
                moving = true;
                if (percent < left) {
                  percent = left;
                } else if (percent > right) {
                  percent = right;
                }
                return $div.css("left", (percent - right) + "%");
              }).on("click touchend", function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                $label.unbind("mouseleave");
                if (moving) {
                  $element.prop("checked", parseInt($label.parent().css("left"), 10) > -25);
                } else {
                  $element.prop("checked", !$element.is(":checked"));
                }
                moving = false;
                return $element.trigger("change");
              }).on("mouseleave", function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $label.unbind("mouseleave mousemove").trigger("mouseup");
                return $element.prop("checked", parseInt($label.parent().css("left"), 10) > -25).trigger("change");
              }).on("mouseup", function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return $label.trigger("mouseleave");
              });
            });
            if (!$form.data("bootstrap-switch")) {
              return $form.bind("reset", function() {
                return window.setTimeout(function() {
                  return $form.find(".has-switch").each(function() {
                    var $input;
                    $input = $(this).find("input");
                    return $input.prop("checked", $input.is(":checked")).trigger("change");
                  });
                }, 1);
              }).data("bootstrap-switch", true);
            }
          });
        },
        toggleActivation: function() {
          var $element;
          $element = $(this);
          $element.prop("disabled", !$element.is(":disabled")).parents(".has-switch").toggleClass("deactivate");
          return $element;
        },
        isActive: function() {
          return !$(this).is(":disabled");
        },
        setActive: function(active) {
          var $element, $wrapper;
          $element = $(this);
          $wrapper = $element.parents(".has-switch");
          if (active) {
            $wrapper.removeClass("deactivate");
            $element.prop("disabled", false);
          } else {
            $wrapper.addClass("deactivate");
            $element.prop("disabled", true);
          }
          return $element;
        },
        toggleState: function(skip) {
          var $element;
          $element = $(this);
          $element.prop("checked", !$element.is(":checked")).trigger("change", skip);
          return $element;
        },
        toggleRadioState: function(skip) {
          var $element;
          $element = $(this);
          $element.not(":checked").prop("checked", !$element.is(":checked")).trigger("change", skip);
          return $element;
        },
        toggleRadioStateAllowUncheck: function(uncheck, skip) {
          var $element;
          $element = $(this);
          if (uncheck) {
            $element.not(":checked").trigger("change", skip);
          } else {
            $element.not(":checked").prop("checked", !$element.is(":checked")).trigger("change", skip);
          }
          return $element;
        },
        setState: function(value, skip) {
          var $element;
          $element = $(this);
          $element.prop("checked", value).trigger("change", skip);
          return $element;
        },
        setOnLabel: function(value) {
          var $element;
          $element = $(this);
          $element.siblings(".switch-left").html(value);
          return $element;
        },
        setOffLabel: function(value) {
          var $element;
          $element = $(this);
          $element.siblings(".switch-right").html(value);
          return $element;
        },
        setOnClass: function(value) {
          var $element, $switchLeft, cls;
          $element = $(this);
          $switchLeft = $element.siblings(".switch-left");
          cls = $element.attr("data-on");
          if (typeof value === "undefined") {
            return;
          }
          if (typeof cls !== "undefined") {
            $switchLeft.removeClass("switch-" + cls);
          }
          $switchLeft.addClass("switch-" + value);
          return $element;
        },
        setOffClass: function(value) {
          var $element, $switchRight, cls;
          $element = $(this);
          $switchRight = $element.siblings(".switch-right");
          cls = $element.attr("data-off");
          if (typeof value === "undefined") {
            return;
          }
          if (typeof cls !== "undefined") {
            $switchRight.removeClass("switch-" + cls);
          }
          $switchRight.addClass("switch-" + value);
          return $element;
        },
        setAnimated: function(value) {
          var $div, $element;
          $element = $(this);
          $div = $element.parent();
          if (value == null) {
            value = false;
          }
          $div.data("animated", value).attr("data-animated", value)[$div.data("animated") !== false ? "addClass" : "removeClass"]("switch-animate");
          return $element;
        },
        setSizeClass: function(value) {
          var $element, $label, $switchLeft, $switchRight;
          $element = $(this);
          $switchLeft = $element.siblings(".switch-left");
          $label = $element.siblings("label");
          $switchRight = $element.siblings(".switch-right");
          $.each(["switch-mini", "switch-small", "switch-large"], function(i, cls) {
            if (cls !== value) {
              $switchLeft.removeClass(cls);
              $label.removeClass(cls);
              return $switchRight.removeClass(cls);
            } else {
              $switchLeft.addClass(cls);
              $label.addClass(cls);
              return $switchRight.addClass(cls);
            }
          });
          return $element;
        },
        setTextLabel: function(value) {
          var $element;
          $element = $(this);
          $element.siblings("label").html(value || "&nbsp");
          return $element;
        },
        setTextIcon: function(value) {
          var $element;
          $element = $(this);
          $element.siblings("label").html(value ? "<i class=\"icon " + value + "\"></i>" : "&nbsp;");
          return $element;
        },
        status: function() {
          return $(this).is(":checked");
        },
        destroy: function() {
          var $div, $element, $form;
          $element = $(this);
          $div = $element.parent();
          $form = $div.closest("form");
          $div.children().not($element).remove();
          $element.unwrap().unwrap().unbind("change");
          if ($form.length) {
            $form.unbind("reset").removeData("bootstrapSwitch");
          }
          return $element;
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }
      if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      }
      return $.error("Method " + method + " does not exist!");
    };
    return this;
  })(jQuery);

}).call(this);
