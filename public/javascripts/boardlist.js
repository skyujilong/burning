/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-7
 * Time: 下午5:54
 * To change this template use File | Settings | File Templates.
 */
define(['domReady!', 'jquery', 'util', 'boardlist/board', 'bootstrap'], function (doc, $, util, Board) {
    $('#createBox').on('show.bs.modal', function (e) {
        util.resetForm($(this));
    });
    $('form').on('submit', function () {
        return false;
    });
    $('#createBox').find('.submit').click(function (e) {
        var $submitBtn = $(e.target);
        var categoryId = $submitBtn.data('category-id');
        var boardName = $('#createBox').find('input[name="boardName"]').val();
        var board = new Board(null, boardName);
        board.createBoard( categoryId, function (data) {
            if (data && data.rs == 1) {
                location.reload(true);
            } else {
                alert('system error');
            }
        });
    });

    $('.board-del').click(function (e) {
        var categoryId = $(e.target).data('category-id');
        var boardId = $(e.target).data('board-id');
        var board = new Board(boardId);
        board.deleteBoard(categoryId, function (data) {
            if (data && data.rs == 1) {
                location.reload();
            } else {
                alert('system error');
            }
        });
    });

    $('.board-update').click(function (e) {
        var $updateBtn = $(e.target);
        var boardId = $updateBtn.data('board-id');
        var categoryId = $updateBtn.data('category-id');
        var boardName = $updateBtn.data('board-name');
        $('#updateBox').find('input[name="boardName"]').val(boardName);
        $('#updateBox').find('input[name="categoryId"]').val(categoryId);
        $('#updateBox').find('input[name="boardId"]').val(boardId);
    });

    $('#updateBox').find('.submit').click(function (e) {
        var $update = $('#updateBox');
        var board = new Board($update.find('input[name="boardId"]').val(), $update.find('input[name="boardName"]').val());
        board.updateBoard( $update.find('input[name="categoryId"]').val(), function (data) {
            if (data && data.rs == 1) {
                location.reload(true);
            } else {
                alert('system error');
            }
        })
    });
});