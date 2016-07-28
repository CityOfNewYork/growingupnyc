module.exports = function () {
  var $filterForm = jQuery('.filter__form'),
      $inputs;

  if ($filterForm.length) {
    $inputs = $filterForm.find('select');

    $inputs.on('change', function() {
      return this.form.submit();
    });
  }
}