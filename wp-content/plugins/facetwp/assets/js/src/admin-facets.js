(function($) {

    /* ======== Autocomplete ======== */

    wp.hooks.addAction('facetwp/load/autocomplete', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-placeholder').val(obj.placeholder);
    });

    wp.hooks.addFilter('facetwp/save/autocomplete', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['placeholder'] = $this.find('.facet-placeholder').val();
        return obj;
    });

    /* ======== Checkboxes ======== */

    wp.hooks.addAction('facetwp/load/checkboxes', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-parent-term').val(obj.parent_term);
        $this.find('.facet-hierarchical').prop('checked', ('yes' === obj.hierarchical));
        $this.find('.facet-show-expanded').prop('checked', ('yes' === obj.show_expanded));
        $this.find('.facet-ghosts').prop('checked', ('yes' === obj.ghosts));
        $this.find('.facet-preserve-ghosts').prop('checked', ('yes' === obj.preserve_ghosts));
        $this.find('.facet-operator').val(obj.operator);
        $this.find('.facet-orderby').val(obj.orderby);
        $this.find('.facet-count').val(obj.count);
        $this.find('.facet-soft-limit').val(obj.soft_limit);
    });

    wp.hooks.addFilter('facetwp/save/checkboxes', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['parent_term'] = $this.find('.facet-parent-term').val();
        obj['hierarchical'] = $this.find('.facet-hierarchical').is(':checked') ? 'yes' : 'no';
        obj['show_expanded'] = $this.find('.facet-show-expanded').is(':checked') ? 'yes' : 'no';
        obj['ghosts'] = $this.find('.facet-ghosts').is(':checked') ? 'yes' : 'no';
        obj['preserve_ghosts'] = $this.find('.facet-preserve-ghosts').is(':checked') ? 'yes' : 'no';
        obj['operator'] = $this.find('.facet-operator').val();
        obj['orderby'] = $this.find('.facet-orderby').val();
        obj['count'] = $this.find('.facet-count').val();
        obj['soft_limit'] = $this.find('.facet-soft-limit').val();
        return obj;
    });

    /* ======== Date Range ======== */

    wp.hooks.addAction('facetwp/load/date_range', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-source-other').val(obj.source_other);
        $this.find('.facet-compare-type').val(obj.compare_type);
        $this.find('.facet-date-fields').val(obj.fields);
        $this.find('.facet-format').val(obj.format);
    });

    wp.hooks.addFilter('facetwp/save/date_range', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['source_other'] = $this.find('.facet-source-other').val();
        obj['compare_type'] = $this.find('.facet-compare-type').val();
        obj['fields'] = $this.find('.facet-date-fields').val();
        obj['format'] = $this.find('.facet-format').val();
        return obj;
    });

    /* ======== Dropdown ======== */

    wp.hooks.addAction('facetwp/load/dropdown', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-label-any').val(obj.label_any);
        $this.find('.facet-parent-term').val(obj.parent_term);
        $this.find('.facet-orderby').val(obj.orderby);
        $this.find('.facet-hierarchical').val(obj.hierarchical);
        $this.find('.facet-count').val(obj.count);
    });

    wp.hooks.addFilter('facetwp/save/dropdown', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['label_any'] = $this.find('.facet-label-any').val();
        obj['parent_term'] = $this.find('.facet-parent-term').val();
        obj['orderby'] = $this.find('.facet-orderby').val();
        obj['hierarchical'] = $this.find('.facet-hierarchical').val();
        obj['count'] = $this.find('.facet-count').val();
        return obj;
    });

    /* ======== fSelect ======== */

    wp.hooks.addAction('facetwp/load/fselect', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-label-any').val(obj.label_any);
        $this.find('.facet-parent-term').val(obj.parent_term);
        $this.find('.facet-multiple').prop('checked', ('yes' === obj.multiple));
        $this.find('.facet-hierarchical').prop('checked', ('yes' === obj.hierarchical));
        $this.find('.facet-ghosts').prop('checked', ('yes' === obj.ghosts));
        $this.find('.facet-preserve-ghosts').prop('checked', ('yes' === obj.preserve_ghosts));
        $this.find('.facet-operator').val(obj.operator);
        $this.find('.facet-orderby').val(obj.orderby);
        $this.find('.facet-count').val(obj.count);
    });

    wp.hooks.addFilter('facetwp/save/fselect', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['label_any'] = $this.find('.facet-label-any').val();
        obj['parent_term'] = $this.find('.facet-parent-term').val();
        obj['multiple'] = $this.find('.facet-multiple').is(':checked') ? 'yes' : 'no';
        obj['hierarchical'] = $this.find('.facet-hierarchical').is(':checked') ? 'yes' : 'no';
        obj['ghosts'] = $this.find('.facet-ghosts').is(':checked') ? 'yes' : 'no';
        obj['preserve_ghosts'] = $this.find('.facet-preserve-ghosts').is(':checked') ? 'yes' : 'no';
        obj['operator'] = $this.find('.facet-operator').val();
        obj['orderby'] = $this.find('.facet-orderby').val();
        obj['count'] = $this.find('.facet-count').val();
        return obj;
    });

    $(document).on('change', '.facet-multiple', function() {
        var $facet = $(this).closest('.facetwp-row');
        var display = ('yes' == $(this).val()) ? 'table-row' : 'none';
        $facet.find('.facet-operator').closest('tr').css({ 'display' : display });
    });

    /* ======== Hierarchy ======== */

    wp.hooks.addAction('facetwp/load/hierarchy', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-orderby').val(obj.orderby);
        $this.find('.facet-count').val(obj.count);
    });

    wp.hooks.addFilter('facetwp/save/hierarchy', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['orderby'] = $this.find('.facet-orderby').val();
        obj['count'] = $this.find('.facet-count').val();
        return obj;
    });

    /* ======== Number Range ======== */

    wp.hooks.addAction('facetwp/load/number_range', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-source-other').val(obj.source_other);
        $this.find('.facet-number-fields').val(obj.fields);
        $this.find('.facet-compare-type').val(obj.compare_type);
    });

    wp.hooks.addFilter('facetwp/save/number_range', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['source_other'] = $this.find('.facet-source-other').val();
        obj['fields'] = $this.find('.facet-number-fields').val();
        obj['compare_type'] = $this.find('.facet-compare-type').val();
        return obj;
    });

    /* ======== Proximity ======== */

    wp.hooks.addAction('facetwp/load/proximity', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-source-other').val(obj.source_other);
        $this.find('.facet-unit').val(obj.unit);
        $this.find('.facet-radius-ui').val(obj.radius_ui);
        $this.find('.facet-radius-options').val(obj.radius_options);
        $this.find('.facet-radius-default').val(obj.radius_default);
        $this.find('.facet-radius-min').val(obj.radius_min);
        $this.find('.facet-radius-max').val(obj.radius_max);
    });

    wp.hooks.addFilter('facetwp/save/proximity', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['source_other'] = $this.find('.facet-source-other').val();
        obj['unit'] = $this.find('.facet-unit').val();
        obj['radius_ui'] = $this.find('.facet-radius-ui').val();
        obj['radius_options'] = $this.find('.facet-radius-options').val();
        obj['radius_default'] = $this.find('.facet-radius-default').val();
        obj['radius_min'] = $this.find('.facet-radius-min').val();
        obj['radius_max'] = $this.find('.facet-radius-max').val();
        return obj;
    });

    wp.hooks.addAction('facetwp/change/proximity', function($this) {
        $this.closest('.facetwp-row').find('.facet-radius-ui').trigger('change');
    });

    $(document).on('change', '.facet-radius-ui', function() {
        var $facet = $(this).closest('.facetwp-row');
        var ui = $(this).val();

        var radius_options = ('dropdown' == ui) ? 'table-row' : 'none';
        var range = ('slider' == ui) ? 'table-row' : 'none';

        $facet.find('.facet-radius-options').closest('tr').css({ 'display' : radius_options });
        $facet.find('.facet-radius-min').closest('tr').css({ 'display' : range });
    });

    /* ======== Radio ======== */

    wp.hooks.addAction('facetwp/load/radio', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-parent-term').val(obj.parent_term);
        $this.find('.facet-ghosts').prop('checked', ('yes' === obj.ghosts));
        $this.find('.facet-preserve-ghosts').prop('checked', ('yes' === obj.preserve_ghosts));
        $this.find('.facet-orderby').val(obj.orderby);
        $this.find('.facet-count').val(obj.count);
    });

    wp.hooks.addFilter('facetwp/save/radio', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['parent_term'] = $this.find('.facet-parent-term').val();
        obj['ghosts'] = $this.find('.facet-ghosts').is(':checked') ? 'yes' : 'no';
        obj['preserve_ghosts'] = $this.find('.facet-preserve-ghosts').is(':checked') ? 'yes' : 'no';
        obj['orderby'] = $this.find('.facet-orderby').val();
        obj['count'] = $this.find('.facet-count').val();
        return obj;
    });

    /* ======== Rating ======== */

    wp.hooks.addAction('facetwp/load/rating', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
    });

    wp.hooks.addFilter('facetwp/save/rating', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        return obj;
    });

    /* ======== Search ======== */

    wp.hooks.addAction('facetwp/load/search', function($this, obj) {
        $this.find('.facet-search-engine').val(obj.search_engine);
        $this.find('.facet-placeholder').val(obj.placeholder);
        $this.find('.facet-auto-refresh').prop('checked', ('yes' === obj.auto_refresh));
    });

    wp.hooks.addFilter('facetwp/save/search', function(obj, $this) {
        obj['search_engine'] = $this.find('.facet-search-engine').val();
        obj['placeholder'] = $this.find('.facet-placeholder').val();
        obj['auto_refresh'] = $this.find('.facet-auto-refresh').is(':checked') ? 'yes' : 'no';
        return obj;
    });

    wp.hooks.addAction('facetwp/change/search', function($this) {
        $this.closest('.facetwp-row').find('.name-source').hide();
    });

    /* ======== Slider ======== */

    wp.hooks.addAction('facetwp/load/slider', function($this, obj) {
        $this.find('.facet-source').val(obj.source);
        $this.find('.facet-source-other').val(obj.source_other);
        $this.find('.facet-compare-type').val(obj.compare_type);
        $this.find('.facet-prefix').val(obj.prefix);
        $this.find('.facet-suffix').val(obj.suffix);
        $this.find('.facet-format').val(obj.format);
        $this.find('.facet-step').val(obj.step);
    });

    wp.hooks.addFilter('facetwp/save/slider', function(obj, $this) {
        obj['source'] = $this.find('.facet-source').val();
        obj['source_other'] = $this.find('.facet-source-other').val();
        obj['compare_type'] = $this.find('.facet-compare-type').val();
        obj['prefix'] = $this.find('.facet-prefix').val();
        obj['suffix'] = $this.find('.facet-suffix').val();
        obj['format'] = $this.find('.facet-format').val();
        obj['step'] = $this.find('.facet-step').val();
        return obj;
    });

})(jQuery);