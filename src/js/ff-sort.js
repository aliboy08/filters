console.log('FF_Sort')
function FF_Sort(options){
    var _ = this;
    _.options = options;
    _.el = options.el;
    _.events = [];
    _.settings('items', null);
    _.settings('string_types', []);

    if( typeof options.el === 'string' ) {
        // selector
        _.el = document.querySelector(options.el);
        if( !_.el ) {
            console.error('cannot find element ', options.el);
            return; // can't find element, exit
        }
    }
    else {
        // dom element
        _.el = options.el;
        if( typeof _.el[0] !== 'undefined' ) _.el = _.el[0]; // jquery support
    }

    _.current_selected = _.el.value;

    _.el.addEventListener('change',e=>{
        _.sort(e.target.value);
    });

    return this;
}

FF_Sort.prototype.settings = function(option_key, default_value){
    if( typeof this.options[option_key] !== 'undefined' ) {
        this[option_key] = this.options[option_key];
    }
    else {
        this[option_key] = default_value;
    }
}

FF_Sort.prototype.on = function( event_name, fn ){
    var _ = this;
    if( typeof _.events[event_name] === 'undefined' ) {
        _.events[event_name] = [];
    }
    _.events[event_name].push(fn);
}

FF_Sort.prototype.event_dispatcher = function( event_name, params ){
    var _ = this;
    if( typeof _.events[event_name] !== 'undefined' ) {
        _.events[event_name].forEach(function(fn){
            fn(params);
        })
    }
}

FF_Sort.prototype.set_items = function(items){
    this.items = items;
}

FF_Sort.prototype.sort = function(key){
    
    var _ = this;

    if( key == _.current_selected ) return; // no change
    _.current_selected = key;

    var order = 'desc';

    // check if has order specified
    var temp = key.split('--');
    if( typeof temp[1] !== 'undefined' ) {
        key = temp[0];
        order = temp[1];
    }

    if( _.options.string_types[key] !== -1 ) {
        // string
        _.items.sort(function(a, b){
            if( order == 'desc' ) {
                return a[key] > b[key] ? -1 : 1;
            }
            return a[key] > b[key] ? 1 : -1;
        });
    }
    else {
        // number
        _.items.sort(function(a, b){
            if( order == 'desc' ) {
                return b[key] - a[key];
            }
            return a[key] - b[key];
        });
    }

    _.event_dispatcher( 'change', { results: _.items } );
}

export default FF_Sort;