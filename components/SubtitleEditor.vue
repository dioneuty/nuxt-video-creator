<template>
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">자막 편집기</h2>
        <div v-if="subtitles.length === 0" class="text-gray-600 dark:text-gray-400 text-center py-4">
            자막이 없습니다. 새 자막을 추가해주세요.
        </div>
        <draggable v-model="subtitles" @end="onDragEnd" item-key="id" class="space-y-2">
            <template #item="{ element, index }">
                <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span class="cursor-move">☰</span>
                    <input v-model="element.startTime" type="text" placeholder="시작 시간" class="border p-2 rounded w-24">
                    <input v-model="element.endTime" type="text" placeholder="종료 시간" class="border p-2 rounded w-24">
                    <input v-model="element.text" type="text" placeholder="자막 텍스트" class="border p-2 rounded flex-grow">
                    <select v-model="element.position" class="border p-2 rounded">
                        <option value="bottom">하단</option>
                        <option value="top">상단</option>
                        <option value="middle">중앙</option>
                    </select>
                    <button @click="removeSubtitle(index)" class="bg-red-500 text-white p-2 rounded">삭제</button>
                </div>
            </template>
        </draggable>
        <button @click="addSubtitle" class="mt-4 bg-blue-500 text-white p-2 rounded">새 자막 추가</button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const subtitles = ref([])
const emit = defineEmits(['update:subtitles'])

const addSubtitle = () => {
    subtitles.value.push({ 
        id: Date.now(), // 고유 ID 추가
        startTime: 0, 
        endTime: 0, 
        text: '', 
        position: 'bottom' // 기본 위치
    })
    emitSubtitles()
}

const removeSubtitle = (index) => {
    subtitles.value.splice(index, 1)
    emitSubtitles()
}

const emitSubtitles = () => {
    emit('update:subtitles', subtitles.value)
}

const onDragEnd = () => {
    emitSubtitles()
}

watch(subtitles, () => {
    emitSubtitles()
}, { deep: true })
</script>