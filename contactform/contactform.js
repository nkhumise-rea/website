jQuery(document).ready(function ($) {
  "use strict";

  const DEFAULT_ACTION = 'mail/contact_me.php';
  const DEFAULT_ERROR_MESSAGE = 'wrong Input';
  const EMAIL_PATTERN = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

  // Parse a "data-rule" attribute such as "minlen:4" into its name and argument.
  function parseRule(ruleAttribute) {
    const separator = ruleAttribute.indexOf(':');
    if (separator < 0) {
      return { name: ruleAttribute, arg: undefined };
    }
    return {
      name: ruleAttribute.substr(0, separator),
      arg: ruleAttribute.substr(separator + 1)
    };
  }

  // Return true when the field's value violates its declared rule.
  function hasRuleViolation(value, rule) {
    switch (rule.name) {
      case 'required':
        return value === '';
      case 'minlen':
        return value.length < parseInt(rule.arg, 10);
      case 'email':
        return !EMAIL_PATTERN.test(value);
      case 'regexp':
        return !new RegExp(rule.arg).test(value);
      default:
        return false;
    }
  }

  // Validate a single field, render its message, and report whether it failed.
  function validateField($field) {
    const ruleAttribute = $field.attr('data-rule');
    if (ruleAttribute === undefined) {
      return false;
    }

    const rule = parseRule(ruleAttribute);
    const failedChecked = rule.name === 'checked' && !$field.is(':checked');
    const failed = failedChecked || hasRuleViolation($field.val(), rule);

    const message = failed
      ? ($field.attr('data-msg') !== undefined ? $field.attr('data-msg') : DEFAULT_ERROR_MESSAGE)
      : '';
    $field.next('.validation').html(message).show('blind');

    return failed;
  }

  // Validate every input and textarea; return true if any field failed.
  function validateForm($fields) {
    let hasError = false;
    $fields.children('input, textarea').each(function () {
      if (validateField($(this))) {
        hasError = true;
      }
    });
    return hasError;
  }

  function submitForm($form) {
    const action = $form.attr('action') || DEFAULT_ACTION;
    $.ajax({
      type: "POST",
      url: action,
      data: $form.serialize(),
      success: function (response) {
        const succeeded = response === 'OK';
        $("#sendmessage").toggleClass("show", succeeded);
        $("#errormessage").toggleClass("show", !succeeded);
        if (succeeded) {
          $form.find("input, textarea").val("");
        } else {
          $('#errormessage').html(response);
        }
      }
    });
  }

  $('form.contactForm').submit(function () {
    const $form = $(this);
    if (validateForm($form.find('.form-group'))) {
      return false;
    }
    submitForm($form);
    return false;
  });

});
