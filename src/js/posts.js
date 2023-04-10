import Filters from "./filters";

console.log(items_data);

function init(){
    
    var items_con = document.querySelector('.items');

    var filter_options = {
        tags: [],
    };

    var items = [];
    
    items_data.posts.forEach(item_data=>{
        
        // create items
        var item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = item_data.title;
        items_con.appendChild(item);

        item_data.el = item;

        items.push(item_data);
        
        // create filter options
        item_data.tags.forEach(item_tag=>{
            if( filter_options.tags.indexOf( item_tag ) === -1 ) {
                filter_options.tags.push( item_tag );
            }
        })
        
    });

    filter_options.tags.sort();
    
    // populate tags options
    // var temp_el = document.querySelector('.filter_tags');
    // var temp_html = `<option value="">Tags</option>`;
    // filter_options.tags.forEach(item=>{
    //     temp_html += '<option value="'+ item +'">'+ item +'</option>';
    // });
    // temp_el.innerHTML = temp_html;

    // populate category buttons
    var temp_el = document.querySelector('.filter_tags_buttons');
    var temp_html = '';
    filter_options.tags.forEach(item=>{
        temp_html += '<button class="filter-item" data-filter-value="'+ item +'">'+ item +'</button>';
    })
    temp_el.innerHTML = temp_html;

    var filters = new Filters({
        filter_return: 'all',
    });

    // var selected_options = [];
    // var selected_options_con = document.querySelector('.filter_tags_con .selected_options');
    // filters.on('change_tags',(res)=>{
    //     var value = res.value;
    //     if( !value )  return; 

    //     console.log( 'change_tags', value )

    //     // add filter indicators - on click remove
    //     if( selected_options.indexOf(value) === -1 ) {
    //         selected_options.push(value);
    //         var button = document.createElement('button');
    //         button.innerText = 'x '+ value;
    //         button.addEventListener('click',()=>{
    //             var index = selected_options.indexOf(value);
    //             console.log( 'remove', index, value );
    //             button.remove();
    //             selected_options.splice(index, 1);
    //             filters.filters.tags.splice(index, 1);
    //             filters.update();
    //         });
    //         selected_options_con.appendChild(button);
    //     }
    // });
    
    filters.set_items(items);

    // filters.add_field({
    //     // type: 'dropdown_multiple',
    //     type: 'dropdown',
    //     el: '.filter_tags',
    // });

    filters.add_field({
        type: 'items_multiple',
        el: '.filter_tags_buttons',
    });

    filters.add_field({
        key: 'reactions',
        type: 'dropdown',
        el: '.filter_reactions',
        filter_type: 'range',
    });

    filters.on('update',(res)=>{
        items_con.innerHTML = '';
        res.items_to_show.forEach(item=>{
            items_con.append(item.el);
        })
    });

    window.filters = filters;

}
init();