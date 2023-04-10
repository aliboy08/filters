import FF_Filters from "./ff-filters";

function init(){
    
    var items_con = document.querySelector('.items');

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
        // item.style.backgroundImage = 'url('+ item_data.thumbnail +')';
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
    
    // populate brand options
    var temp_el = document.querySelector('.filter_brand');
    var temp_html = `<option value="">Brand</option>`;
    filters_dropdown.brand.forEach(item=>{
        temp_html += '<option value="'+ item +'">'+ item +'</option>';
    });
    temp_el.innerHTML = temp_html;

    // populate category buttons
    var temp_el = document.querySelector('.filter_category');
    var temp_html = '';
    filters_dropdown.category.forEach(item=>{
        temp_html += '<button class="filter-item" data-filter-value="'+ item +'">'+ item +'</button>';
    })
    temp_el.innerHTML = temp_html;


    var filters = new FF_Filters({
        return_data: 'el',
    });

    var selected_brands = [];
    var selected_brands_con = document.querySelector('.filter_brand_con .selected_options');
    filters.on('change_brand',(res)=>{
        var brand = res.value;
        if( !brand ) {
            return;
        }

        console.log( 'change_brand', )

        // add filter indicators - on click remove
        if( selected_brands.indexOf(brand) === -1 ) {
            selected_brands.push(brand);
            var button = document.createElement('button');
            button.innerText = 'x '+ brand;
            button.addEventListener('click',()=>{
                var index = selected_brands.indexOf(brand);
                console.log( 'remove', index, brand );
                button.remove();
                selected_brands.splice(index, 1);
                filters.filters.brand.splice(index, 1);
                filters.update();
            });
            selected_brands_con.appendChild(button);
        }
    });
    
    filters.set_items(items);

    filters.add_field({
        type: 'dropdown_multiple',
        el: '.filter_brand',
    });

    filters.add_field({
        type: 'items_multiple',
        el: '.filter_category',
    });

    filters.add_field({
        key: 'price',
        type: 'dropdown',
        el: '.filter_price',
        filter_type: 'range',
    });

    filters.on('update',(res)=>{
        console.log('update', res.items_to_show, res.active_filters )
        items_con.innerHTML = '';
        res.items_to_show.forEach(el=>{
            items_con.append(el);
        })
    });

    window.filters = filters;

}
init();