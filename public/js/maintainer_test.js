class CustomTextEditor {
    constructor(props) {
        const el = document.createElement('input');
        const {
            maxLength
        } = props.columnInfo.editor.options;

        el.type = 'text';
        el.maxLength = maxLength;
        el.value = String(props.value);

        this.el = el;
    }

    getElement() {
        return this.el;
    }

    getValue() {
        return this.el.value;
    }

    mounted() {
        this.el.select();
    }
}

const grid = new tui.Grid({
    el: document.getElementById('grid'),
    scrollX: false,
    scrollY: false,
    columns: [{
            header: 'Name',
            name: 'name',
            editor: 'text'
        },
        {
            header: 'Artist',
            name: 'artist',
            editor: {
                type: CustomTextEditor,
                options: {
                    maxLength: 10
                }
            }
        },
        {
            header: 'Type',
            name: 'typeCode',
            formatter: 'listItemText',
            editor: {
                type: 'select',
                options: {
                    listItems: [{
                            text: 'Deluxe',
                            value: '1'
                        },
                        {
                            text: 'EP',
                            value: '2'
                        },
                        {
                            text: 'Single',
                            value: '3'
                        }
                    ]
                }
            }
        },
        {
            header: 'Genre',
            name: 'genreCode',
            formatter: 'listItemText',
            editor: {
                type: 'checkbox',
                options: {
                    listItems: [{
                            text: 'Pop',
                            value: '1'
                        },
                        {
                            text: 'Rock',
                            value: '2'
                        },
                        {
                            text: 'R&B',
                            value: '3'
                        },
                        {
                            text: 'Electronic',
                            value: '4'
                        },
                        {
                            text: 'etc.',
                            value: '5'
                        }
                    ]
                }
            },
            copyOptions: {
                useListItemText: true // when this option is used, the copy value is concatenated text
            }
        },
        {
            header: 'Grade',
            name: 'grade',
            copyOptions: {
                useListItemText: true
            },
            formatter: 'listItemText',
            editor: {
                type: 'radio',
                options: {
                    listItems: [{
                            text: '★☆☆',
                            value: '1'
                        },
                        {
                            text: '★★☆',
                            value: '2'
                        },
                        {
                            text: '★★★',
                            value: '3'
                        }
                    ]
                }
            }
        }
    ]
});
grid.on('beforeChange', ev => {
    console.log('before change:', ev);
});
grid.on('afterChange', ev => {
    console.log('after change:', ev);
})
grid.resetData([
    {
        name: 'Nombre 1',
        artist: 'Artista 1',
        typeCode: '2',
        genreCode: '1',
        grade: '2',
    },
    {
        name: 'Nombre 2',
        artist: 'Artista 2',
        typeCode: '2',
        genreCode: '3',
        grade: '1',
    },
    {
        name: 'Nombre 3',
        artist: 'Artista 3',
        typeCode: '3',
        genreCode: '1',
        grade: '3',
    },
]);

