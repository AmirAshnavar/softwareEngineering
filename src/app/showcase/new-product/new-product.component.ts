import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { DataService } from "../../services/data-service.service";
import { Product } from "../../models/product.model";
import { mimeType } from "./mime-type.validator";
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  product: Product;
  isLoading = false;
  form: FormGroup;
  submitClicked = false;
  imagePreview: string;
  @Input() mode: string = 'create';
  @Input() productToEdit: Product = null;
  unit: number = 100;
  unitLabel: string = 'هزارتومان';
  shownUnit: number = 100;
  priceLabel: string = 'هزارتومان';
  shownPrice: number = 100;
  ;
  constructor(public dataService: DataService,
    public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      category: new FormControl(0, { validators: [Validators.required] }),
      price: new FormControl(100, { validators: [Validators.required] })
    });

    this.dataService.newPostAdded.subscribe(() => {
      this.reset();
    })
  }



  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    this.submitClicked = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.dataService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.category,
        this.form.value.price

      );
    } else {
      // this.dataService.updatePost(
      //   this.product._id,
      //   this.form.value.title,
      //   this.form.value.content,
      //   this.form.value.image
      // );
    }
  }

  reset() {
    this.isLoading = false;
    this.submitClicked = false;
    this.mode = ' create';
    this.imagePreview = '';
    this.enteredTitle = "";
    this.enteredContent = "";
    this.productToEdit = null;
    this.product = null;
    this.form.reset();
  }

  increasePrice() {
    if (this.form.value.price + this.unit < 1000000) {
      this.form.patchValue({ price: this.form.value.price + this.unit });
      if (this.form.value.price < 1000) {
        this.priceLabel = 'هزارتومان';
        this.shownPrice = this.form.value.price;
      } else if (this.form.value.price >= 1000) {
        this.priceLabel = 'میلیون تومان';
        this.shownPrice = this.form.value.price / 1000;

      }
    }
  }

  decreasePrice() {
    if (this.form.value.price - this.unit > 0) {
      this.form.patchValue({ price: this.form.value.price - this.unit });
      if (this.form.value.price < 1000) {
        this.priceLabel = 'هزارتومان';
        this.shownPrice = this.form.value.price;
      } else if (this.form.value.price >= 1000) {
        this.priceLabel = 'میلیون تومان';
        this.shownPrice = this.form.value.price / 1000;

      }
    }
  }


  increaseUnit() {
    if (this.unit * 10 <= 100000) {
      this.unit *= 10;
      if (this.unit < 1000) {
        this.unitLabel = 'هزارتومان';
        this.shownUnit = this.unit;
      } else if (this.unit >= 1000) {
        this.unitLabel = 'میلیون تومان';
        this.shownUnit = this.unit / 1000;

      }
    }
  }

  decreaseUnit() {
    if (this.unit / 10 > 0) {
      this.unit /= 10;
      if (this.unit < 1000) {
        this.unitLabel = 'هزارتومان';
        this.shownUnit = this.unit;
      } else if (this.unit >= 1000) {
        this.unitLabel = 'میلیون تومان';
        this.shownUnit = this.unit / 1000;

      }
    }
  }
}
