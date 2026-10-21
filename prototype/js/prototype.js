/* MedRisk prototype — progressive-enhancement helpers (vanilla JS, no build step)
 *
 * Scope of this file (prototype stage, DIP-8):
 *   1. questionnaire progress indicator (how many of the 12 questions are done);
 *   2. client-side validation with inline, field-linked error messages;
 *   3. echoing the submitted answers back on the result page.
 *
 * The script only *adds* behaviour: every page still works with JavaScript
 * disabled (plain links, native HTML form GET, static tables).
 *
 * IMPORTANT (product safety): the script NEVER computes a risk. The risk values
 * shown on the result page are a fixed illustrative example; only the user's
 * own input is echoed back.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ utils */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function labelFor(control) {
    if (control.id) {
      var explicit = document.querySelector('label[for="' + control.id + '"]');
      if (explicit) {
        return explicit.textContent.replace(/\s+/g, ' ').trim().replace(/\s*\([^)]*\)\s*$/, '');
      }
    }
    var fieldset = control.closest('fieldset');
    if (fieldset) {
      var legend = fieldset.querySelector('legend');
      if (legend) {
        return legend.textContent.replace(/\s+/g, ' ').trim();
      }
    }
    return 'This field';
  }

  function errorElementFor(control) {
    var id = control.getAttribute('aria-describedby') || '';
    var ids = id.split(/\s+/);
    for (var i = 0; i < ids.length; i++) {
      var candidate = document.getElementById(ids[i]);
      if (candidate && candidate.classList.contains('field-error')) {
        return candidate;
      }
    }
    return null;
  }

  function setError(control, message) {
    var box = errorElementFor(control);
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (box) {
      box.textContent = message || '';
    }
  }

  /* -------------------------------------------------------------- progress */
  function questionnaireGroups(form) {
    /* One "question" per form control group: number inputs and radio groups. */
    var groups = [];
    $$('[data-question]', form).forEach(function (control) {
      if (control.type === 'radio') {
        if (!groups.some(function (g) { return g.name === control.name; })) {
          groups.push({
            name: control.name,
            type: 'radio',
            controls: [],
            optional: control.hasAttribute('data-optional')
          });
        }
        return;
      }
      groups.push({
        name: control.name,
        type: 'control',
        controls: [control],
        optional: control.hasAttribute('data-optional')
      });
    });
    return groups;
  }

  function groupIsAnswered(group) {
    if (group.type === 'radio') {
      var checked = document.querySelectorAll('input[name="' + group.name + '"]:checked');
      return checked.length > 0;
    }
    return group.controls.every(function (c) { return String(c.value).trim() !== ''; });
  }

  function initProgress(form) {
    /* The progress bar lives above the form, so it is looked up in the document. */
    var progress = $('[data-progress-bar]');
    var text = $('[data-progress-text]');
    if (!progress || !text) { return; }

    var groups = questionnaireGroups(form);
    var required = groups.filter(function (g) { return !g.optional; });
    var optional = groups.filter(function (g) { return g.optional; });

    function update() {
      var answered = groups.filter(groupIsAnswered).length;
      var answeredRequired = required.filter(groupIsAnswered).length;
      progress.max = groups.length;
      progress.value = answered;
      progress.setAttribute(
        'aria-valuetext',
        answered + ' of ' + groups.length + ' questions answered'
      );
      text.textContent =
        answered + ' of ' + groups.length + ' questions answered' +
        ' · ' + answeredRequired + ' of ' + required.length + ' required' +
        (optional.length ? ' · ' + optional.length + ' optional measurements can be skipped' : '');
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  }

  /* ------------------------------------------------------------ validation */
  function validateControl(control) {
    if (control.type === 'radio') {
      var group = control.closest('fieldset');
      var radios = group ? $$('input[type="radio"][name="' + control.name + '"]', group) : [control];
      var anyChecked = radios.some(function (r) { return r.checked; });
      if (control.hasAttribute('required') && !anyChecked) {
        return 'Select one option for “' + labelFor(control) + '”.';
      }
      return '';
    }

    var value = String(control.value).trim();
    var optional = control.hasAttribute('data-optional');

    if (value === '') {
      if (control.hasAttribute('required') && !optional) {
        return 'Enter a value for “' + labelFor(control) + '”.';
      }
      return '';
    }

    var num = Number(value);
    if (!isNaN(num) && (control.type === 'number' || control.type === 'range')) {
      var min = control.getAttribute('min');
      var max = control.getAttribute('max');
      if (min !== null && num < Number(min)) {
        return 'The value for “' + labelFor(control) + '” must be ' + min + ' or more.';
      }
      if (max !== null && num > Number(max)) {
        return 'The value for “' + labelFor(control) + '” must be ' + max + ' or less.';
      }
      var step = control.getAttribute('step');
      if (step && step !== 'any') {
        var base = min !== null ? Number(min) : 0;
        var steps = (num - base) / Number(step);
        if (Math.abs(steps - Math.round(steps)) > 1e-9) {
          return 'The value for “' + labelFor(control) + '” must be a multiple of ' + step + '.';
        }
      }
    }
    return '';
  }

  function initValidation(form) {
    var summary = $('[data-form-summary]');
    var summaryList = summary ? $('[data-form-summary-list]', summary) : null;
    var summaryTitle = summary ? $('[data-form-summary-title]', summary) : null;

    function validateAll() {
      var problems = [];
      $$('[data-question]', form).forEach(function (control) {
        /* Validate only the first radio of a group to avoid duplicate messages. */
        if (control.type === 'radio') {
          var group = control.closest('fieldset');
          var radios = group ? $$('input[type="radio"][name="' + control.name + '"]', group) : [control];
          if (radios.indexOf(control) !== 0) { return; }
          var msg = validateControl(control);
          setError(control, msg);
          radios.forEach(function (r) { r.setAttribute('aria-invalid', msg ? 'true' : 'false'); });
          if (msg) {
            problems.push({ control: radios[0], message: msg });
          }
          return;
        }
        var message = validateControl(control);
        setError(control, message);
        if (message) {
          problems.push({ control: control, message: message });
        }
      });
      return problems;
    }

    /* Re-validate a control once the user has tried to fix it. */
    form.addEventListener('blur', function (event) {
      var control = event.target;
      if (control && control.matches && control.matches('[data-question]')) {
        if (control.type === 'radio') {
          var group = control.closest('fieldset');
          var radios = group ? $$('input[type="radio"][name="' + control.name + '"]', group) : [control];
          if (radios.indexOf(control) !== 0) { return; }
          var msg = validateControl(control);
          setError(control, msg);
          radios.forEach(function (r) { r.setAttribute('aria-invalid', msg ? 'true' : 'false'); });
          return;
        }
        setError(control, validateControl(control));
      }
    }, true);

    form.addEventListener('submit', function (event) {
      var problems = validateAll();

      if (problems.length === 0) { return; }

      event.preventDefault();

      if (summary && summaryList) {
        summaryList.innerHTML = '';
        problems.forEach(function (problem) {
          var item = document.createElement('li');
          var link = document.createElement('a');
          link.href = '#' + problem.control.id;
          link.textContent = problem.message;
          link.addEventListener('click', function () {
            problem.control.focus();
          });
          item.appendChild(link);
          summaryList.appendChild(item);
        });
        if (summaryTitle) {
          summaryTitle.textContent =
            problems.length === 1
              ? 'Please fix 1 field before continuing:'
              : 'Please fix ' + problems.length + ' fields before continuing:';
        }
        summary.hidden = false;
      }

      problems[0].control.focus();
    });

    /* Submitting with the keyboard must behave exactly like clicking. */
    form.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.matches('input[type="number"], input[type="text"]')) {
        var submit = $('button[type="submit"]', form);
        if (submit) { submit.click(); }
      }
    });
  }

  /* ------------------------------------------------- echo answers on result */
  function initEcho() {
    var container = $('[data-echo-root]');
    if (!container) { return; }

    var params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length === 0) {
      var placeholder = $('[data-echo-empty]', container);
      if (placeholder) { placeholder.hidden = false; }
      return;
    }

    var emptyNote = $('[data-echo-empty]', container);
    if (emptyNote) { emptyNote.hidden = true; }

    $$('[data-echo]', container).forEach(function (cell) {
      var key = cell.getAttribute('data-echo');
      if (!params.has(key)) { return; }
      var raw = params.get(key);

      /* Radio answers are shown with their human-readable label, not the raw value.
         The mapping travels with the cell, so the result page is self-contained. */
      var options = cell.getAttribute('data-echo-options');
      if (options) {
        var pairs = options.split('|');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          if (pair[0] === raw) {
            cell.textContent = pair[1];
            return;
          }
        }
      }
      cell.textContent = raw;
    });

    var stamp = $('[data-echo-date]');
    if (stamp) {
      var now = new Date();
      stamp.textContent = now.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    }
  }

  /* ------------------------------------------------------------------ init */
  function init() {
    var form = $('[data-questionnaire]');
    if (form) {
      initProgress(form);
      initValidation(form);
    }
    initEcho();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
