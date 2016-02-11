(function ($) {

    $.fn.boxFile = function (custom) {
        "use strict";

        var optDefault = {
            'text': 'Clique aqui para selecionar um arquivo<br>Somente images PNG ou JPEG, de no máximo 6MB',
            'error': {
                'default': 'Ocorreu um erro no carregamento desse arquivo<br>Verifique se o arquivo é compatível e clique novamente para seleciona-lo.',
                'mimetype': 'Tipo de arquivo inválido, verifique o tipo do arquivo e clique aqui para selecionar novamente.',
                'size': 'Arquivo muito grande. Selecione um arquivo menor e tente novamente.',
                404: 'Não foi possível se conectar-se ao servidor remoto. Tente novamente mais tarde. (404)'
            },
            'action': false,
            'extension': '',
            'delete': false,
            'deleteType': 'DELETE_QUERY',
            'mimetype': ['image/*', 'text/plain'],
            'log': true,
            'maxSize': 6291456, // 6mb
            'closeClass': 'fa fa-times'
        };

        var merge = function (object, target) {
            var newObject = {};
            for (var key in object)
                if (target[key] != undefined)
                    newObject[key] = target[key];
                else
                    newObject[key] = object[key];

            return newObject;
        };

        var error = false;

        var options = (typeof custom == 'object') ? merge(optDefault, custom) : optDefault;

        var input = $(this);

        if (input.attr('text'))
            options['text'] = input.attr('text');

        if (input.attr('error'))
            options['error'] = input.attr('error');

        var close = $('<a>').addClass('close').html('<i class="'+options['closeClass']+'"></i>').attr('title', 'Clique para remover essa imagem');

        var content = $('<div>').html(options['text']).addClass('content');

        var img = $('<img>').attr('src', '');

        var icon = $('<i>').addClass('file');

        var bar = $('<span>');

        var barWrap = $('<div>').addClass('bar').append(bar);

        var info = $('<div>').addClass('info');

        var box = $('<div>').addClass('boxfile').append(close).append(content).append(img).append(icon).append(barWrap).append(info);

        var form = $(this).parents('form');

        var actionUrl = options['action'] ? options['action'] : form.attr('action') ? form.attr('action') : '';

        var deleteUrl = options['delete'] ? options['delete'] : form.data('delete') ? form.data('delete') : '';

        var currentImg = $('img', form);

        var fontFile = {
            'audio': 'fa fa-file-sound-o',
            'movie': 'fa fa-file-movie-o',
            'video': 'fa fa-file-movie-o',
            'image': 'fa fa-file-picture-o',
            'text': 'fa fa-file-text-o',
            'php': 'fa fa-file-code-o',
            'xml': 'fa fa-file-code-o',
            'html': 'fa fa-file-code-o',
            'javascript': 'fa fa-file-code-o',
            'sql': 'fa fa-file-code-o',
            'css': 'fa fa-file-code-o',
            'csv': 'fa fa-file-excel-o',
            'excel': 'fa fa-file-excel-o',
            'pdf': 'fa fa-file-pdf-o',
            'word': 'fa fa-file-word-o',
            'powerpoint': 'fa fa-file-powerpoint-o',
            'zip': 'fa fa-file-zip-o',
            'compressed': 'fa fa-file-zip-o'
        };

        var func = {
            'init': function () {
                input.before(box).hide();
                close.hide();
                img.hide();
                icon.hide();
                info.hide();
                barWrap.hide();

                if (currentImg.is('img'))
                    func.initalImg();

                box.click(function () {
                    input.click()
                });

                input.change(function (event) {

                    var reader = new FileReader();

                    reader.onload = function (e) {
                        if (options.log)
                            func.log(e);

                        func.reset();
                        content.hide();
                        close.show();
                        func.mimetype(e);
                        func.loader();
                    };

                    reader.readAsDataURL(event.target.files[0]);

                    window.boxfilePrepareFile = event.target.files[0];


                });

                close.click(function () {
                    $(window).trigger('clickRemove', [func.currentFile()]);
                    if (func.currentFile())
                        func.remove(function () {
                            func.reset()
                        })
                    else
                        func.reset();

                    return false
                })

            },

            'log': function (e) {
                var log = {
                    'file': e.target.result
                };

                var type = func.getType(e);

                log.mimetype = type;

                log.accepted = (func.valide(e)) ? 'Yes' : 'No';

                log.image = (type.indexOf('image') > -1) ? 'Yes' : 'No';

                log.icon = 'No';

                log.size = e.total;

                if (log.image == 'No')
                    for (var key in fontFile) {
                        var typeSplit = type.split('/');
                        if (key.indexOf(typeSplit[0]) || key.indexOf(typeSplit[1]))
                            log.icon = fontFile[key]
                    }

            },

            'valide': function (e) {
                var type = func.getType(e);

                if (options.mimetype.indexOf(type) < 0) {

                    var mime = type.split('/')[0];

                    if (options.mimetype.indexOf(mime + '/*') >= 0)
                        return func.size(e);

                    error = 'mimetype';

                    return false;
                }

                return func.size(e);
            },

            'size': function (e) {
                if (options.maxSize)
                    if (e.total > options.maxSize) {
                        error = 'size';
                        return false
                    }

                return true
            },

            'getType': function (e) {
                var data = e.target.result.split(';');
                return data[0].split(':')[1];
            },

            'mimetype': function (e) {
                var type = func.getType(e);

                if (!func.valide(e))
                    return;

                if (type.indexOf('image') > -1)
                    img.attr('src', e.target.result).show();
                else {

                    icon.attr('class', 'file fa-file-o').css('display', 'block');

                    for (var key in fontFile) {
                        var typeSplit = type.split('/');
                        if (key.indexOf(typeSplit[0]) >= 0 || key.indexOf(typeSplit[1]) >= 0) {
                            icon.attr('class', 'file ' + fontFile[key]);
                            break;
                        }
                    }
                }


            },

            'loader': function () {
                if (error) {
                    icon.addClass('fa fa-ban').css('display', 'block');
                    func.error();
                    return;
                }

                barWrap.show();
                bar.show();
                func.submit();
            },

            'success': function () {
                if (box.hasClass('error'))
                    box.removeClass('error');

                box.addClass('success');
                bar.addClass('success');
                func.closeBar();

                return false;
            },

            'error': function (error) {
                if (box.hasClass('success'))
                    box.removeClass('success');

                if(!error || !options.error[error])
                    error = 'default';

                info.html(options.error[error]).show();
                box.addClass('error');
                bar.addClass('error');
                func.closeBar();

                return false;
            },

            'closeBar': function () {
                barWrap.slideUp(function () {
                    $(this).hide()
                })
            },

            'reset': function () {
                error = false;
                icon.attr('class', 'file');
                input.val('');
                close.hide();
                img.hide().attr('src', '');
                info.hide();
                barWrap.hide();
                content.show();
                box.removeClass('success').removeClass('error');
                bar.width('0%').removeClass('success').removeClass('error').hide();
            },

            'submit': function () {
                var data = new FormData();
                data.append(input.attr('name') ? input.attr('name') : 0, window.boxfilePrepareFile);

                $.ajax({
                    url: actionUrl + options['extension'],
                    type: 'POST',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-File-Name': window.boxfilePrepareFile.name
                    },
                    processData: false,
                    contentType: false,
                    'data': data,
                    success: function (data) {
                        if (typeof data['name'] == 'undefined')
                            return func.error();

                        if (func.currentFile())
                            func.remove(function () {
                                func.currentFile(data);
                            });
                        else
                            func.currentFile(data);

                        func.success()
                    },
                    error: function(data){
                        return func.error(data.status);
                    },

                    dataType: 'json',

                    xhr: function () {
                        var xhr = new XMLHttpRequest();

                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var progress = ((evt.loaded / evt.total) * 100);
                                progress = progress.toFixed(0);
                                bar.width(progress + '%')
                            }
                        }, false);
                        return xhr;
                    }
                });
            },

            'remove': function (callback) {
                var _url, _type, _data = false;

                switch(options['deleteType']){
                    case 'DELETE_URL':
                        _url = deleteUrl + func.currentFile().target + options['extension'];
                        _type = 'DELETE';
                        break;
                    case 'DELETE_QUERY':
                        _url = deleteUrl + '?' + (input.attr('name') ? input.attr('name') : 'file') + '=' + func.currentFile().target + options['extension'];
                        _type = 'DELETE';
                        break;
                    case 'POST':
                        _url = deleteUrl + options['extension'];
                        _type = 'POST';
                        _data = {};
                        _data[(input.attr('name') ? input.attr('name') : 'file')] = func.currentFile().target;
                        break;
                }

                $.ajax({
                    url: _url,
                    type: _type,
                    data: _data,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data) {
                            $(window).trigger('deleteFile', [func.currentFile()]);
                            func.currentFile(false);
                            return callback.call();
                        }

                        alert('Não foi possível remover esse arquivo. Tente novamente mais tarde.')
                    },
                    dataType: 'json'
                })
            },

            'currentFile': function (file) {
                if (file === undefined)
                    return window.boxfileCurrentFile;

                if(typeof file == 'object')
                    file['target'] = file.id ? file.id : file.name;

                window.boxfileCurrentFile = file;

                if (file)
                    $(window).trigger('newFile', [file]);
            },

            'initalImg': function () {
                if (currentImg.attr('value'))
                    func.currentFile({
                        'id': currentImg.attr('value')
                    });

                else if (currentImg.attr('src'))
                    var src = currentImg.attr('src').split('/')
                    src = src[src.length - 1];
                    func.currentFile({
                        'name': src
                    });

                var currentSrc = currentImg.attr('src');
                currentImg.remove();
                img.attr('src', currentSrc).show();


                close.show();
                content.hide();
                box.addClass('success')
            }
        };

        func.init();

    }

})(jQuery);
