from django.shortcuts import render
from datetime import datetime

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import *
from api.serializers import ProductSerializer, OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    # Validar dados recebidos
    required_fields = ['orderItems', 'paymentMethod', 'taxPrice',
                       'shippingPrice', 'totalPrice', 'shippingAddress']
    for field in required_fields:
        if field not in data:
            return Response({'Atenção': f'O campo "{field}" é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

    orderItems = data['orderItems']

    if not orderItems or len(orderItems) == 0:
        return Response({'Atenção': 'Nenhum item adicionado.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
        )

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        for i in orderItems:
            product = Product.objects.get(_id=i['_id'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            product.countInStock -= int(item.qty)
            product.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Product.DoesNotExist:
        return Response({'Atenção': 'Um dos produtos não existe.'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'Atenção': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if order.user == user:
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        else:
            return Response({'Atenção': 'Você não possui permissão para visualizar esse pedido.'},
                            status=status.HTTP_403_FORBIDDEN)

    except Order.DoesNotExist:
        return Response({'Atenção': 'O pedido não existe.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'Atenção': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()
        return Response('O pedido foi pago.', status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        return Response({'Atenção': 'O pedido não existe.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'Atenção': str(e)}, status=status.HTTP_400_BAD_REQUEST)
