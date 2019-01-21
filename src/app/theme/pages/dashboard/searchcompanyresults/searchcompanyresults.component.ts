import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit
} from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { DataService } from "../../../../_services/data.service";
import { SendFormDataService } from "../../../../_services/send-form-data.service";

@Component({
    selector: "app-search-company-results",
    templateUrl: "./searchcompanyresults.component.html",
    encapsulation: ViewEncapsulation.None
})
export class SearchCompanyResultsComponent implements OnInit, AfterViewInit {
    data: any;
    loading = false;
    save_loading = false;

    private company: object = {
        name: "CDK Global",
        job: "Computer Software, 5001-10,000 employees, Greater Chicago Area",
        img: "assets/app/media/img/companies/0.png",
        // university: "Harvard University",
        // city: "New York"
    };

    private pageSelection: string = 'page';
    private isRowSelected: boolean = false;

    constructor(
        private _script: ScriptLoaderService,
        private dataService: DataService,
        private sendformdataService: SendFormDataService
    ) { }

    ngOnInit() {
        this.dataService.getCompany().subscribe(data => {
            this.data = data;
        }, error => { });

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo7/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handleAdvancedSearchFormSubmit();
            });

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo7/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handleSaveSearchFormSubmit();
            });

        var datatable = (<any>$("#search_company_json_data")).mDatatable({
            // datasource definition
            data: {
                type: "remote",
                source: {
                    read: {
                        url: "./json/company.json",
                        method: "GET"
                    }
                },
                pageSize: 10
            },

            // toolbar
            toolbar: {
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        pageSizeSelect: [10, 20, 30],
                    }
                }
            },

            // layout definition
            layout: {
                theme: "default", // datatable theme
                class: "we_connect_table", // custom wrapper class
                height: 680,
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false // display/hide footer
            },

            // column sorting
            sortable: false,

            pagination: true,

            search: {
                input: $(".m-header-search__input")
            },

            // columns definition
            columns: [
                {
                    field: "RecordID",
                    title: "#",
                    width: 50,
                    sortable: false,
                    textAlign: "center",
                    selector: { class: "m-checkbox--solid m-checkbox--brand" }
                },
                {
                    field: "img",
                    title: "Logo",
                    width: 50,
                    sortable: false,
                    template: function(row) {
                        return (
                            '<img src="' +
                            row.img +
                            '" class="profile-img" data-id="' +
                            row.id +
                            '"/>'
                        );
                    }
                },
                {
                    field: "name",
                    title: "Name",
                    width: 250,
                    sortable: false,
                    template: function(row) {
                        return (
                            '<span class="m-widget3__username">' +
                            row.name +
                            '</span><br>\
                                    <span class="m-widget3__time">' +
                            row.job +
                            "</span>"
                        );
                    }
                },
                {
                    field: "status",
                    title: "Status",
                    overflow: "visible",
                    sortable: false,
                    template: function(row) {
                        return '<ul class="m-portlet__nav table-nav-portlet">\
                            <li class="m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push" m-dropdown-toggle="hover" aria-expanded="true">\
                                <a href="#" class="m-portlet__nav-link m-portlet__nav-link--icon m-portlet__nav-link--icon-xl m-dropdown__toggle">\
                                    <i class="la la-ellipsis-h m--font-brand table-drop-icon"></i>\
                                </a>\
                                <div class="m-dropdown__wrapper">\
                                    <span class="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust"></span>\
                                    <div class="m-dropdown__inner">\
                                        <div class="m-dropdown__body">\
                                            <div class="m-dropdown__content">\
                                                <ul class="m-nav">\
                                                    <li class="m-nav__item">\
                                                        <a href="javascript:;" class="m-nav__link drop-link-remove" data-id="' + row.id + '">\
                                                            <i class="m-nav__link-icon la la-remove"></i>\
                                                            <span class="m-nav__link-text">Remove</span>\
                                                        </a>\
                                                    </li>\
                                                </ul>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </li>\
                        </ul>';
                    }
                }
            ]
        });

        let that = this;
        jQuery(document)
            .off("click", ".m-datatable__body .m-datatable__row")
            .on("click", ".m-datatable__body .m-datatable__row", function() {
                $(this).closest('tbody').find('.m-datatable__row--selected').removeClass('m-datatable__row--selected');
                $(this).addClass('m-datatable__row--selected');

                let id = $(this).find('.profile-img').attr("data-id");
                that.company = that.data.find(x => x.id == id);
            });

        jQuery(document).ready(function() {
            $(".m-datatable__table tr:last").find("td:last").find(".m-portlet__nav-item").addClass("m-dropdown--up");
        });

        jQuery(document).on('click', function() {
            $(".m-datatable__table tr:last").find("td:last").find(".m-portlet__nav-item").addClass("m-dropdown--up");
        });

        jQuery(document)
            .off('click', '.drop-link-remove')
            .on('click', '.drop-link-remove', function() {
            var id = $(this).attr('data-id');
            that.selectRemove(String(id));
        })
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-search-company-results", [
            "assets/app/js/dashboard.js"
        ]);
        this._script.loadScripts("app-search-company-results", [
            "json/js/select2.js"
        ]);
    }

    private selectRow() {
        var isChecked = $('#table_row_select_control').prop('checked');
        $('.we_connect_table').children('table').children('tbody').find('tr:visible').find('input[type="checkbox"]').prop('checked', isChecked);
    }

    advancedSearch() {
        this.loading = true;
        setTimeout(() => {
            (<any>$('#advanced_filter')).modal('hide');
            this.loading = false;
        }, 500);
    }

    handleAdvancedSearchFormSubmit() {
        $('.advancd-search-btn').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    first_name: {
                        required: true,
                    },
                    last_name: {
                        required: true,
                    },
                    job_title: {
                        required: true,
                    },
                    comapny_name: {
                        required: true,
                    },
                    industry: {
                        required: true,
                    },
                    location: {
                        required: true,
                    }
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    saveSearch() {
        this.save_loading = true;
        setTimeout(() => {
            (<any>$('#save_search')).modal('hide');
            this.save_loading = false;
        }, 500);
    }

    handleSaveSearchFormSubmit() {
        $('.save-search-btn').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    search_name: {
                        required: true,
                    }
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    sendData() {
        this.sendformdataService.sendData().subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }

    removeData() {
        this.sendformdataService.sendData().subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }

    refresh() {
        this.sendformdataService.sendData().subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }

    selectRemove(id: string) {
        this.sendformdataService.sendId(id).subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }
}
