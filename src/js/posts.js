import FF_Filters from "./ff-filters";
import FF_Search from "./ff-search";
import FF_Sort from "./ff-sort";

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

        var title = document.createElement('h3');
        title.classList.add('title');
        title.innerHTML = item_data.title +' - ' + item_data.reactions;
        item.appendChild(title);

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

    // Filters
    var filterer = new FF_Filters({
        items: items,
        return_data: 'all',
    });

    filterer.add_field({
        type: 'items_multiple',
        el: '.filter_tags_buttons',
    });

    filterer.add_field({
        key: 'reactions',
        type: 'dropdown',
        el: '.filter_reactions',
        filter_type: 'range',
    });

    filterer.on('update',(res)=>{
        items_con.innerHTML = '';
        res.items_to_show.forEach(item=>{
            items_con.append(item.el);
        })
    });

    // Sort
    var sorter = new FF_Sort({
        items: items,
        el: '.sort',
        string_types: ['title'],
    });

    sorter.on('change', function(res){
        console.log('on sort', res);
        items_con.innerHTML = '';
        res.results.forEach(item=>{
            items_con.append(item.el);
        });
    })

    // Search
    var searcher = new FF_Search({
        items: items,
        el: '.filter_search',
        return_data: 'all',
        search_fields: [
            'title',
            'body'
        ],
    });

    searcher.on('search',res=>{
        // console.log( 'search', {res, filterer} );

        filterer.set_items(res.results);
        sorter.set_items(res.results);

        if( filterer.active_filters.length ) {
            // run filter
            filterer.update();
        }
        else {
            items_con.innerHTML = '';
            res.results.forEach(item=>{
                items_con.append(item.el);
            });
        }

    })
    
}
init();