console.log('FF_Search')
function FF_Search(options){
    var _ = this;
    _.options = options;
    _.el = options.el;
    _.typing_timeout = null;
    _.search_string = '';
    _.events = {};
    _.settings('typing_duration', 1000);
    _.settings('search_fields', 'el');
    _.settings('return_data', 'el');

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

    _.el.addEventListener('keyup',e=>{
        _.input_typing(e);
    });

    _.el.addEventListener('change',e=>{
        _.submit(e.target.value);
    });

    _.el.addEventListener('search',e=>{
        _.submit(e.target.value);
    });

    return this;
}

FF_Search.prototype.settings = function(option_key, default_value){
    if( typeof this.options[option_key] !== 'undefined' ) {
        this[option_key] = this.options[option_key];
    }
    else {
        this[option_key] = default_value;
    }
}

FF_Search.prototype.on = function( event_name, fn ){
    var _ = this;
    if( typeof _.events[event_name] === 'undefined' ) {
        _.events[event_name] = [];
    }
    _.events[event_name].push(fn);
}

FF_Search.prototype.event_dispatcher = function( event_name, params ){
    var _ = this;
    if( typeof _.events[event_name] !== 'undefined' ) {
        _.events[event_name].forEach(function(fn){
            fn(params);
        })
    }
}

FF_Search.prototype.set_items = function(items){
    this.items = items;
}

FF_Search.prototype.input_typing = function(e){
    var _ = this;
    var input = e.target.value;
    clearTimeout( _.typing_timeout );
    
    // Enter key pressed, submit immediately
    if( e.key == 'Enter' || e.keyCode == 13 ) {
        _.submit(input);
        return;
    }

    _.typing_timeout = setTimeout(function(){
        _.submit(input);
    }, _.typing_duration );
}

FF_Search.prototype.submit = function(input){
    var _ = this;
    if( input == _.search_string ) return; // no change
    _.search_string = input;
    var results = _.search_items(_.search_string);
    _.event_dispatcher( 'search', { results, search_string: _.search_string } );
}

FF_Search.prototype.search_items = function(s){
    var _ = this;
    var results = [];

    s = s.toLowerCase();

    _.items.forEach(item=>{
        if( _.search_fields == 'el' ) {
            // search element text
            var item_string = item.el.innerText.toLowerCase();
            if( item_string.indexOf(s) !== -1 ) {
                results.push(_.return_item(item));
            }
        }
        else {
            if( typeof _.search_fields === 'object' ) {
                // array
                for( var i = 0; i < _.search_fields.length; i++ ) {
                    var search_field = _.search_fields[i];
                    if( typeof item[search_field] === 'undefined' || !item[search_field] ) return;
                    var item_string = item[search_field].toLowerCase();
                    if( item_string.indexOf(s) !== -1 ) {
                        results.push(_.return_item(item));
                        return;
                    }
                }

            }
            else {
                // single
                if( typeof item[_.search_fields] === 'undefined' || !item[_.search_fields] ) return;
                var item_string = item[_.search_fields].toLowerCase();
                if( item_string.indexOf(s) !== -1 ) {
                    results.push(_.return_item(item));
                }
            }
        }
    })

    return results;
}

FF_Search.prototype.return_item = function(item){
    return item;
}

export default FF_Search;