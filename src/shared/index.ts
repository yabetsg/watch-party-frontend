export const handleLogout = () => {
    localStorage.removeItem("token");
    location.reload();
}

