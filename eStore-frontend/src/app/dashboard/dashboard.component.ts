import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private productsService: ProductsService) {}
  userId: any = localStorage.getItem('userId');
  params: any = {
    pageNumber: '',
    pageSize: 10,
    search: '',
    userId: this.userId,
  };
  products: any = [];
  ngOnInit(): void {
    this.productsService
      .getAllProducts(this.userId, this.params)
      .subscribe((response: any) => {
        this.products = response.rows;
        console.log(this.products);
      });
  }
}
