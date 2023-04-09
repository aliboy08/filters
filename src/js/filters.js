function Filters(options){
    var _ = this;
    _.options = options;
    _.events = {};
    _.items = [];
    _.filters = {};
    _.active_filters = [];
    _.fields = {};
    _.timeout;

    _.filter_return = 'id';
    if( typeof options.filter_return !== 'undefined' ) {
        _.filter_return = options.filter_return;
    }
}

Filters.prototype.set_items = function(items){
    this.items = items;
}

Filters.prototype.set = function(filter_key, filter_value){
    this.filters[filter_key] = filter_value;
}

Filters.prototype.update = function(){
    var _ = this;
    var items_to_show = _.filter_items();
    console.log( 'update', { items_to_show } )
    _.event_dispatcher( 'update', { item_ids: items_to_show, active_filters: _.active_filters } );
}

Filters.prototype.on = function( event_name, fn ){
    var _ = this;
    if( typeof _.events[event_name] === 'undefined' ) {
        _.events[event_name] = [];
    }
    _.events[event_name].push(fn);
}

Filters.prototype.event_dispatcher = function( event_name, params ){
    var _ = this;
    if( typeof _.events[event_name] !== 'undefined' ) {
        _.events[event_name].forEach(function(fn){
            fn(params);
        })
    }
}

Filters.prototype.add_field = function(options){
    var _ = this;
    // _.fields[options.id] = options;
    switch( options.type ) {
        // case 'items_multiple': _.init_type_items_multiple(options); break;
        // case 'items_single': _.init_type_items_single(options); break;
        // case 'rating': _.init_type_rating(options); break;
        // case 'slider': _.init_type_slider(options); break;
        case 'dropdown': _.init_type_dropdown(options); break;
    }
}

Filters.prototype.prepare_field = function(options){
    var _ = this;

    if( typeof options.el === 'string' ) {
        // selector
        var el = document.querySelector(options.el);
        if( !el ) {
            console.error('cannot find element ', options.el);
            return; // can't find element, exit
        }
    }
    else {
        // dom element
        var el = options.el;
        if( typeof el[0] !== 'undefined' ) el = el[0]; // jquery support
    }

    if( typeof options.key === 'undefined' ) {
        // filter key not set, get from element attribute
        var filter_key = el.dataset.filterKey;
    }
    else {
        var filter_key = options.key;
    }

    _.fields[filter_key] = options;

    var field = _.fields[filter_key];

    field.el = el;
    field.key = filter_key;

    return field;
}

Filters.prototype.init_type_dropdown = function(options){
    var _ = this;
    
    var field = _.prepare_field(options);

    field.current_value = '';

    options.el.addEventListener('change', function(){
        if( this.value == field.current_value ) return; // no change
        field.current_value = this.value;
        _.set( field.key, this.value );
        _.update();
    });

    // populate dropdown choices
    if( typeof options.choices !== 'undefined' ) {
        options.choices.forEach(function(choice){
            options.el.append('<option value="'+ choice +'">'+ choice +'</option>');
        })
    }
}

Filters.prototype.filter_items = function(){
    var _ = this;

    _.active_filters = _.get_active_filters();

    var items_to_show = [];

    if( _.filter_return == 'all' ) {
        _.items.forEach(function(item){
            if( _.show_item(item, _.active_filters ) ) {
                items_to_show.push(item);
            }
        });
    }
    else {
        console.log( _.filter_return )
        _.items.forEach(function(item){
            if( _.show_item(item, _.active_filters ) ) {
                items_to_show.push(item[_.filter_return]);
            }
        });
    }

    return items_to_show;
}

Filters.prototype.show_item = function(item, filters){
    
    for( var i = 0; i < filters.length; i++ ) {

        var filter = filters[i];
        var item_value = item[filter.key];
        
        // rating
        if( filter.key == 'rating' ) {
            if( item_value < filter.value ) {
                return false;
            }
            continue;
        }
        // price
        else if( filter.key == 'price' ) {
            // min price > item price || filter max price > item price
            if( filter.value[0] > item_value || filter.value[1] < item_value ) {
                return false;
            }
            continue;
        }
        
        if( typeof filter.value === 'object' ) {
            // filter value: array

            if( typeof item_value === 'object' ) {
                // item value: array
                var array_item_found = false;
                for( var j = 0; j < item_value.length; j++ ) {
                    if( filter.value.indexOf(item_value[j]) !== -1 ) {
                        array_item_found = true;
                        break;
                    }
                }

                if( !array_item_found ) {
                    return false;
                }

            }
            else {
                // item value: single
                if( filter.value.indexOf(item_value) === -1 ) {
                    return false;
                }
            }
            
        }
        else {

            if( typeof item_value === 'object' ) {
                if( item_value.indexOf( filter.value ) === -1 ) {
                    return false;
                }
            }
            else {
                // filter value: single, direct compare
                if( item_value != filter.value ) {
                    return false;
                }
            }
            
        }
        
    }

    // passed, show item
    return true;
}

Filters.prototype.get_active_filters = function(){
    var _ = this;
    var filters_to_check = [];
    
    Object.keys(_.filters).forEach(function(filter_key){
        var filter_value = _.filters[filter_key];
        
        if( typeof filter_value === 'object' && !filter_value.length ) return;
        if( !filter_value ) return;
    
        filters_to_check.push({
            key: filter_key,
            value: filter_value,
        });
    });
    
    return filters_to_check;
}

export default Filters;