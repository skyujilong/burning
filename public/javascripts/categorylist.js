/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-6
 * Time: 上午10:03
 * To change this template use File | Settings | File Templates.
 */
define(['domReady!', 'jquery', 'util', 'categorylist/category', 'bootstrap'], function (doc, $, util, Category){
    $('#createBox').on('show.bs.modal', function (e) {
        util.resetForm($(this));
    });

    $('#createBox').find('.submit').click(function (e) {
        var categoryName = $('#createBox').find('input[name="categoryName"]').val();
        var category = new Category(categoryName);
        category.createCategroy(function (data) {
            if (data.rs == 1) {
                $('#createBox').modal('hide');
                location.reload(true);
            } else {
                alert('error');
            }
        });
    });

    $('.cate-del').click(function(e){
        var _id = $(e.target).data('category-id');
        var cate = new Category(null,_id);
        cate.delCategory(function(data){
            if(data && data.rs == 1){
                location.reload(true);
            }else{
                alert('error');
            }
        });
    });

    $('.cate-update').click(function(e){
        var _id = $(e.target).data('category-id');
        $('#updateBox').find('input[name="categoryId"]')[0].value = _id;
        var name = $(e.target).data('category-name');
        $('#updateBox').find('input[name="categoryName"]').val(name);
    });

    $('#updateBox').find('.submit').click(function(e){
        var categoryId = $('#updateBox').find('input[name="categoryId"]').val();
        var categoryName = $('#updateBox').find('input[name="categoryName"]').val();
        var cate = new Category(categoryName,categoryId);
        cate.updateCategroy(function(data){
            if(data && data.rs == 1){
                $('#updateBox').modal('hide');
                location.reload(true);
            }else{
                alert('error');
            }
        });
    });



});
