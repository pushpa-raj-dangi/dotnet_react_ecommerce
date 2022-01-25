using System;
using System.Collections.Immutable;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetriveBasket();

            if (basket == null)
                return NotFound();
            return MapBasketToDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {

            var basket = await RetriveBasket();
            if (basket == null) basket = CreateBasket();

            var product = await _context.Products.FindAsync(productId);

            if (product == null) return NotFound();

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket." });
        }



        [HttpDelete]
        public async Task<ActionResult> DeleteBasketItem(int productId, int quantity)
        {
            var basket = await RetriveBasket();
            if (basket == null) return NotFound();
            basket.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
                return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem on removing from basket" });

        }


        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };

            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);

            return basket;
        }


        private ActionResult<BasketDto> MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item =>
                             new BasketItemDto
                             {
                                 ProductId = item.ProductId,
                                 Name = item.Product.Name,
                                 Price = item.Product.Price,
                                 Type = item.Product.Type,
                                 PictureUrl = item.Product.PictureUrl
                             }
                                      ).ToList()
            };
        }



        private async Task<Basket> RetriveBasket()
        {
            return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }


    }
}