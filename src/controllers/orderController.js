import prisma from "../prismaClient.js";



export const createOrder = async (req, res) => {
  const { systemUserId, tableId, customerId, kitchenId, products } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        systemUserId,
        tableId,
        customerId,
        // kitchenId,
        status: 'pending',
        orderDetails: {
          create: products.map(p => ({
            menuItemId: p.menuItemId,
            quantity: p.quantity,
            note: p.note || null
          }))
        }
      },
      include: { orderDetails: true }
    })
    res.status(201).json(order)

  } catch (error) {
    res.status(500).json({ error: 'Error creating order', details: error.message })
  }
}



export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        customer: {
        select: {name: true}
      },
        tableId: true,
        systemUser: {
          select: {name: true}
        },
        // kitchen: true,
        orderDetails: { 
          select: { 
            quantity: true,
            menuItem: {
              select:{
                name: true,
                price: true
              }  
            } 
          }
        }
      }
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' })
  }
}




export const getOrderById = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        table: true,
        systemUser: true,
        // kitchen: true,
        orderDetails: { include: { menuItem: true } }
      }
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' })
  }
}




export const updateOrder = async (req, res) => {
  const id = parseInt(req.params.id)
  const { status, tableId } = req.body
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status, tableId }
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error updating order' })
  }
}



export const deleteOrder = async (req, res) => {

  try {
    const id = parseInt(req.params.id)
    const orderId = Number(id)

    // Eliminar primero los detalles del pedido
    await prisma.orderDetail.deleteMany({
      where: { orderId }
    })

    await prisma.order.delete({ where: { id } })
    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error al eliminar pedido:', error)
    res.status(500).json({ error: 'Error deleting order' })
  }
}