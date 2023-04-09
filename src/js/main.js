import items_data from './data.json' assert {type: 'json'};
import Filters from "./filters";

function init(){
    
    var items_con = document.querySelector('.items');
    var filters_con = document.querySelector('.filters');

    var filters_dropdown = {
        brand: [],
        category: [],
    };

    var items = [];
    
    items_data.products.forEach(item_data=>{
        
        // create items
        var item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = item_data.title;
        items_con.appendChild(item);

        item_data.el = item;

        items.push(item_data);
        
        // create filter options
        if( filters_dropdown.brand.indexOf( item_data.brand ) === -1 ) {
            filters_dropdown.brand.push( item_data.brand );
        }

        if( filters_dropdown.category.indexOf( item_data.category ) === -1 ) {
            filters_dropdown.category.push( item_data.category );
        }
        
    });

    filters_dropdown.brand.sort();
    filters_dropdown.category.sort();
    
    filter_dropdown_init( 'brand', 'Brand' );
    // filter_dropdown_init( 'category', 'Category' );
    filter_buttons_init( 'category' );

    // create filters
    function filter_dropdown_init(key, label){
        var dropdown = document.createElement('select');
        dropdown.setAttribute('data-filter-key', key);
        dropdown.classList.add('filter_'+ key);
        var options = `<option value="">${label}</option>`;
        filters_dropdown[key].forEach(item=>{
            options += `<option value="${item}">${item}</option>`;
        });
        dropdown.innerHTML = options;
        filters_con.appendChild(dropdown);
    }

    function filter_buttons_init(key){
        var div = document.createElement('div');
        div.classList.add('buttons');
        var html = '';
        filters_dropdown[key].forEach(item=>{
            html += '<button>'+ item +'</button>';
        })
        div.innerHTML = html;
        filters_con.appendChild(div);
    }

    var filters = new Filters({
        filter_return: 'title',
    });
    filters.set_items(items);
    filters.add_field({
        type: 'dropdown',
        el: '.filter_brand',
    });
}
init();

