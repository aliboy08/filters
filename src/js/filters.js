function Filters(options){
    var _ = this;
    _.options = options;
    _.events = {};
    _.items = [];
    _.filters = {};
    _.active_filters = [];
    _.fields = {};
    _.debounce;
    _.settings('debounce_duration', 500);
    _.settings('filter_return', 'id');
}

Filters.prototype.settings = function(option_key, default_value){
    if( typeof this.options[option_key] !== 'undefined' ) {
        this[option_key] = this.options[option_key];
    }
    else {
        this[option_key] = default_value;
    }
} 

Filters.prototype.set_items = function(items){
    this.items = items;
}

Filters.prototype.set = function(filter_key, filter_value){
    this.filters[filter_key] = filter_value;
}

Filters.prototype.add = function(filter_key, value_to_add){
    this.filters[filter_key].push(value_to_add);
}

Filters.prototype.remove = function(filter_key, value_to_remove){
    var _ = this;
    var index_to_remove = _.filters[filter_key].indexOf(value_to_remove);
    if( index_to_remove !== -1 ) {
        _.filters[filter_key].splice(index_to_remove, 1);
    }
}

Filters.prototype.update = function(){
    var _ = this;
    var items_to_show = _.filter_items();
    // console.log( 'update', { items_to_show } )
    _.event_dispatcher( 'update', { items_to_show: items_to_show, active_filters: _.active_filters } );
}

Filters.prototype.debounced_update = function(){
    var _ = this;
    clearTimeout(_.debounce);
    _.debounce = setTimeout(function(){
        _.update();
    }, _.debounce_duration);
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
        case 'items_single': _.init_type_items_single(options); break;
        case 'items_multiple': _.init_type_items_multiple(options); break;
        // case 'rating': _.init_type_rating(options); break;
        // case 'slider': _.init_type_slider(options); break;
        case 'dropdown': _.init_type_dropdown(options); break;
        case 'dropdown_multiple': _.init_type_dropdown_multiple(options); break;
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

    var filter_key = typeof options.key !== 'undefined' ? options.key : el.dataset.filterKey;
    _.fields[filter_key] = options;

    var filter_type = typeof options.key !== 'undefined' ? options.filter_type : 'default';
    var field = _.fields[filter_key];
    
    field.el = el;
    field.key = filter_key;
    field.filter_type = filter_type;
    
    return field;
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
        _.items.forEach(function(item){
            if( _.show_item(item, _.active_filters ) ) {
                items_to_show.push(item[_.filter_return]);
            }
        });
    }

    return items_to_show;
}

Filters.prototype.show_item = function(item, filters){
    var _ = this;

    for( var i = 0; i < filters.length; i++ ) {

        var filter = filters[i];
        var item_value = item[filter.key];

        console.log( filter.key, filter.value );

        if( _.fields[filter.key].filter_type == 'range' ) {
            var filter_values = filter.value.split(',');
            var filter_value_min = parseInt(filter_values[0]);
            var filter_value_max = parseInt(filter_values[1]);
            console.log( filter_value_min, filter_value_max )
            if( filter_value_min > item_value || filter_value_max < item_value ) {
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

Filters.prototype.init_type_dropdown = function(options){
    var _ = this;
    var field = _.prepare_field(options);
    field.current_value = '';
    
    options.el.addEventListener('change', function(e){

        _.event_dispatcher( 'change_'+ field.key, { el: e.target, value: this.value, key: field.key } );

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

Filters.prototype.init_type_dropdown_multiple = function(options){
    var _ = this;
    var field = _.prepare_field(options);
    _.filters[field.key] = [];
    
    options.el.addEventListener('change', function(e){

        if( !this.value ) return;

        if( _.filters[field.key].indexOf(this.value) !== -1 ) {
            // already selected, unselect/remove
            // _.remove(field.key, this.value);
            return;
        }

        _.event_dispatcher( 'change_'+ field.key, { el: e.target, value: this.value, key: field.key } );
        _.add(field.key, this.value);
        _.update();
        options.el.value = '';
    });
    
    // populate dropdown choices
    if( typeof options.choices !== 'undefined' ) {
        options.choices.forEach(function(choice){
            options.el.append('<option value="'+ choice +'">'+ choice +'</option>');
        })
    }
}

Filters.prototype.init_type_items_single = function(options){

    var _ = this;
    var field = _.prepare_field(options);
    field.items = options.el.querySelectorAll('.filter-item');
    field.current_selected = options.el.querySelector('.selected');
    
    field.items.forEach(item=>{

        item.addEventListener('click',(e)=>{
            
            if( item.classList.contains('selected') ) {
                if( typeof options.unselect !== 'undefined' && !options.unselect ) return;
    
                // unselect
                item.classList.remove('selected');
                field.current_selected = null;
                
                var filter_value = '';
            }
            else {
                // select
                item.classList.add('selected');
    
                // unselect previous item
                if( field.current_selected ) field.current_selected.classList.remove('selected');
                field.current_selected = item;
                
                var filter_value = item.dataset.filterValue;
            }

            _.set( field.key, filter_value );
            _.event_dispatcher( 'change_'+ field.key, { el: e.target, value: filter_value, key: field.key } );
            _.update();
        })

    });

}

Filters.prototype.init_type_items_multiple = function(options){
    var _ = this;
    var field = _.prepare_field(options);
    _.filters[field.key] = [];
    field.items = options.el.querySelectorAll('.filter-item');
    field.items.forEach(item=>{
        item.addEventListener('click',(e)=>{
            var filter_value = item.dataset.filterValue;
            item.classList.toggle('selected');
            if( item.classList.contains('selected') ) {
                _.add(field.key, filter_value);
            } else {
                _.remove(field.key, filter_value);
            }

            _.event_dispatcher( 'change_'+ field.key, { el: e.target, value: filter_value, key: field.key } );
            _.debounced_update();
        })
    });
}

export default Filters;