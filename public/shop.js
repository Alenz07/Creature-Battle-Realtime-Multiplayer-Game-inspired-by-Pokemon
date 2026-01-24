// ============ SHOP ============
async function buyItem(itemId) {
    try {
        const { data } = await axios.post(`${API_URL}/shop/buy`, {
            userId: currentUser.id,
            itemId: itemId
        });
        
        currentUser.money = data.user.money;
        currentUser.pokeballs = data.user.pokeballs;
        updatePlayerStats();
        alert(data.message);
    } catch (error) {
        console.error('Shop error:', error);
        if (error.response && error.response.data) {
            alert(error.response.data.error);
        } else {
            alert('Error purchasing item. Please try again.');
        }
    }
}