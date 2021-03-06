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
    selector: "app-saved-search-results",
    templateUrl: "./savedsearchresults.component.html",
    encapsulation: ViewEncapsulation.None
})
export class SavedSearchResultsComponent implements OnInit, AfterViewInit {
    data: any;
    loading = false;
    save_loading = false;

    private profile: object = {
        name: "Anna Strong",
        job: "Chief Financial Officer, Google Inc",
        img: "assets/app/media/img/users/user1.jpg",
        university: "Stanford University",
        city: "New York",
        connections: "300+ Connections",
        title: "Chief Financial Officer",
        present_comp_img: "assets/app/media/img/client-logos/logo9.png",
        present_company: "Google Inc",
        dates_employed: "Jul 2015 - present",
        present_span: "3 yrs, 2 mos",
        previous_comp_img: "assets/app/media/img/client-logos/logo6.png",
        previous_company: "Oracle Corporation",
        previous_title: "Finance Controller",
        previous_dates_employed: "Jun 2012 - Jun 2015",
        previous_span: "3 yrs",
        previous_comp_img2: "assets/app/media/img/client-logos/logo8.png",
        previous_company2: "Adobe Inc",
        previous_title2: "Finance Manager",
        previous_dates_employed2: "Jun 2010 - May 2012",
        previous_span2: "2 yrs"
    };

    private pageSelection: string = 'page';
    private isRowSelected: boolean = false;

    constructor(
        private _script: ScriptLoaderService,
        private dataService: DataService,
        private sendformdataService: SendFormDataService
    ) { }

    ngOnInit() {
        this.dataService.getData().subscribe(data => {
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

        var datatable = (<any>$("#json_data")).mDatatable({
            // datasource definition
            data: {
                type: "remote",
                source: {
                    read: {
                        url: "./json/data.json",
                        method: "GET"
                    }
                },
                pageSize: 10
            },

            // layout definition
            layout: {
                theme: "default", // datatable theme
                class: "we_connect_table", // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
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
                                                        <a routerLink="" class="m-nav__link table-drop-link">\
                                                            <i class="m-nav__link-icon flaticon-delete-1"></i>\
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
                that.profile = that.data.find(x => x.id == id);
            });
        jQuery(document).ready(function() {
            $(".flaticon-folder").parent().parent().addClass("m-menu__item--active");
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-search-results", [
            "assets/app/js/dashboard.js"
        ]);
        this._script.loadScripts("app-search-results", [
            "json/js/select2.js"
        ]);
    }

    private selectRow() {
        console.log(this.isRowSelected);
        console.log(this.pageSelection);
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
}
