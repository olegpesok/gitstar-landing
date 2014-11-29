var popover = '';

$('#submit').popover({
  content: function() { return popover; },
  placement: 'right',
  trigger: 'focus manual'
});

function formInfo(data) {
  popover = data;
  $('#submit').popover('show');
  $('#submit').attr('disabled', false);
}

$('#emailForm').submit(function (event) {
  $.ajax({
    url: '/sign-up',
    type: 'POST',
    data: 'email=' + $('#email').val()
  }).done(function (data) {
    formInfo('Thanks! We\'ll keep you posted.');
  }).fail(function (xhr) {
    if (xhr.status == 400) {
      formInfo('Invalid email address. Try again!');
    } else {
      formInfo('Woops, something went wrong. Try again!');
    }
  });
  $('#submit').attr('disabled', true);
  event.preventDefault();
});
